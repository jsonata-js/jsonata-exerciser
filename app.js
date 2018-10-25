/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    request = require('request'),
    querystring = require('querystring'),
    path = require('path'),
    shortid = require('shortid'),
    fs = require('fs'),
    jsonata = require('jsonata');

var app = express();

var db;
var dbCredentials = {
    dbName: 'exerciser'
};



var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/codemirror', express.static(__dirname + '/node_modules/codemirror/'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function getReCaptureCredentials() {
    var recaptureCredentials = {
        sitekey: 'default',
        secret: 'default'
    };
    if(process.env.RECAPTURE_SITEKEY && process.env.RECAPTURE_SECRET ) {
        recaptureCredentials = {
            sitekey: process.env.RECAPTURE_SITEKEY,
            secret: process.env.RECAPTURE_SECRET
        }
    }
    return recaptureCredentials;
}

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

function initDBConnection() {
    //When running on Cloud Foundry, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from  VCAP_SERVICES
        try {
            dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
        } catch(err) {
            // failed to load file
            console.log('No cloudant credentials.  Save and share function disabled.');
        }
    }

    if(dbCredentials.url) {
        var cloudant = require('cloudant')(dbCredentials.url);
        db = cloudant.use(dbCredentials.dbName);
    }
}

initDBConnection();
var recaptureCredentials = getReCaptureCredentials();

app.get('/', function(req, res) {
    var inserts = {
        input: JSON.stringify(defaultInput, null, 2),
        jsonata: defaultExpression,
        recapture_sitekey: recaptureCredentials.sitekey,
        sharable: db ? 'visible' : 'hidden'
    };
    res.render('index.html', inserts);
});

app.get('/versions', function(req, res) {
    var url = 'https://registry.npmjs.org/jsonata';
    request({
        url: url,
        method: 'GET'
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            res.status(500).send(error.message);
        } else {
            var json = JSON.parse(body);
            //var tags = jsonata('(versions ~> $keys() ~> $reverse()).("v" & $)').evaluate(json);
            var tags = jsonata('((versions~>$keys()~>$reverse()).$match(/(.+\\..+)\\.(.+)/){groups[0]:"v"&(match)[0]}).*').evaluate(json);
            res.status(200).send({'releases': tags});
        }
    });
});

if(db) {
    app.get('/:id', function (req, res) {
        db.get(req.params.id, function (err, doc) {
            if (err) {
                var inserts = {
                    input: JSON.stringify({
                        status: 404,
                        message: req.protocol + '://' + req.get('host') + '/' + req.params.id + ' not found'
                    }, null, 2),
                    jsonata: "'Oops! ' & message",
                    recapture_sitekey: recaptureCredentials.sitekey,
                    sharable: 'visible'
                };
                res.statusCode = 404;
                res.render('index.html', inserts);
            } else {
                var inserts = {
                    input: doc.input ? JSON.stringify(doc.input, null, 2) : "",
                    jsonata: doc.jsonata ? doc.jsonata : "",
                    recapture_sitekey: recaptureCredentials.sitekey,
                    sharable: 'visible'
                };
                res.render('index.html', inserts);
            }
        });
    });

    app.post('/save', function (req, res) {
        // first check with the reCaptcha service
        var recap_body = querystring.stringify({
            secret: recaptureCredentials.secret,
            response: req.body.recaptcha,
            remoteip: req.connection.remoteAddress
        });

        request({
            url: 'https://www.google.com/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(recap_body)
            },
            body: recap_body
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.status(500).send(error.message);
            } else {
                var recap_body = JSON.parse(body);
                if (recap_body.success === true) {
                    // not a robot! - put it in cloudant
                    var id = shortid.generate();
                    delete req.body.recaptcha; // remove the recaptcha code
                    var now = new Date();
                    req.body.timestamp = now.toISOString();  // add a timestamp

                    db.insert(req.body, id, function (err, doc) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err.message);
                        } else {
                            res.location(req.protocol + '://' + req.get('host') + '/' + id);
                            res.sendStatus(201);
                        }
                    });
                } else {
                    // failed the reCaptcha challenge
                    res.status(400).send('Failed the robot challenge!');
                }
            }
        });
    });
}

app.post('/data', function(req, res) {
    var data = req.body;
    var inserts = {
        input: JSON.stringify(data, null, 2),
        jsonata: ''
    };
    res.render('index.html', inserts);
});

app.post('/slack', function(req, res) {
    humansOnly(req, res, function() {
        // register with slack
        var email = req.body.email;
        var token = process.env.SLACK_TOKEN || 'default';
        var url = 'https://slack.com/api/users.admin.invite';
        request({
            url: url,
            method: 'GET',
            qs: {
                token: token,
                email: email
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.status(500).send(error.message);
            } else {
                var json = JSON.parse(body);
                if(json.ok === true) {
                    res.status(201).send();
                } else {
                    res.status(200).send(json.error);
                }
            }
        });
    });
});

function humansOnly(req, res, callback) {
    // first check with the reCaptcha service
    var recap_body = querystring.stringify({
        secret: recaptureCredentials.secret,
        response: req.body.recaptcha,
        remoteip: req.connection.remoteAddress
    });

    request({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(recap_body)
        },
        body: recap_body
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            res.status(500).send(error.message);
        } else {
            var recap_body = JSON.parse(body);
            if (recap_body.success === true) {
                // not a robot!
                callback();
            } else {
                // failed the reCaptcha challenge
                res.status(400).send('Failed the robot challenge!');
            }
        }
    });

}

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});


var defaultInput = {
  "Account" : {
    "Account Name": "Firefly",
    "Order" : [
      {
        "OrderID" : "order103",
        "Product" : [
          {
            "Product Name" : "Bowler Hat",
            "ProductID" : 858383,
            "SKU": "0406654608",
            "Description" : {
              "Colour" : "Purple",
              "Width" : 300,
              "Height" : 200,
              "Depth" : 210,
              "Weight": 0.75
            },
            "Price" : 34.45,
            "Quantity" : 2
          },
          {
            "Product Name" : "Trilby hat",
            "ProductID" : 858236,
            "SKU": "0406634348",
            "Description" : {
              "Colour" : "Orange",
              "Width" : 300,
              "Height" : 200,
              "Depth" : 210,
              "Weight": 0.6
            },
            "Price" : 21.67,
            "Quantity" : 1
          }
        ]
      },
      {
        "OrderID" : "order104",
        "Product" : [
          {
            "Product Name" : "Bowler Hat",
            "ProductID" : 858383,
            "SKU": "040657863",
            "Description" : {
              "Colour" : "Purple",
              "Width" : 300,
              "Height" : 200,
              "Depth" : 210,
              "Weight": 0.75
            },
            "Price" : 34.45,
            "Quantity" : 4
          },
          {
            "ProductID" : 345664,
            "SKU": "0406654603",
            "Product Name" : "Cloak",
            "Description" : {
              "Colour" : "Black",
              "Width" : 30,
              "Height" : 20,
              "Depth" : 210,
              "Weight": 2.0
            },
            "Price" : 107.99,
            "Quantity" : 1
          }
        ]
      }
    ]
  }
};

var defaultExpression = "Account.Order[0].OrderID";
