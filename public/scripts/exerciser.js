/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

var moment;
if(!window) {
    moment = require('moment');
    require('./cm-jsonata.js');
}
var errorMark;
var jsonataResult;
var jsonataError;

var jsonataVersions = {
    '1.5.0': 'v1.5.0',
    '1.4.1': 'v1.4.1',
    '1.4.0': 'v1.4.0',
    '1.3.3': 'v1.3.3',
    '1.3.2': 'v1.3.2',
    '1.3.1': 'v1.3.1',
    '1.3.0': 'v1.3.0',
    '1.3': 'v1.3.0',
    '1.2.6': 'v1.2.6',
    'local': 'local'
};

var sampleData = {
    Invoice: data1,
    Address: data2,
    Schema: data3
}

window.onload = function () {
    default_text = document.getElementById('source').value || '';

    source = CodeMirror.fromTextArea(document.getElementById('source'), {
        mode: {name: "javascript", json: true},
        lineNumbers: true
    });

    path = CodeMirror.fromTextArea(document.getElementById('path'), {
        mode: {name: 'jsonata', jsonata: window.jsonata, template: false},
        autoCloseBrackets: {
            pairs: "()[]{}",
            triples: "",
            explode: "[]{}()"
        },
        matchBrackets: true,
        extraKeys: {
            F11: function (cm) {  // F11 shortcut for lambda λ
                cm.replaceSelection('\u03BB');
            },
            F7: function() {
                loadJSONata('local');
                document.getElementById("version-select").style.display = 'none';
            }
        },
        viewportMargin: Infinity
    });

    //data1();

    var timer;

    source.on('change', function () {
        clearTimeout(timer);
        timer = setTimeout(eval, 500);
    });

    path.on('change', function () {
        clearTimeout(timer);
        timer = setTimeout(eval, 500);
    });

    result = CodeMirror.fromTextArea(document.getElementById('result'), {
        mode: {name: "javascript", json: true},
        readOnly: true
    });

    timer = setTimeout(eval, 500);

    document.getElementById("json-format").onclick = function() {
        var str = source.getValue();
        str = JSON.parse(str);
        str = JSON.stringify(str, null, 2);
        source.setValue(str);
    };

    window.selectData = function(selection) {
        console.log(selection.value);
        sampleData[selection.value]();
    };

    window.selectVersion = function(selection) {
        console.log(selection.value);
        loadJSONata(selection.value, false);
        timer = setTimeout(eval, 500);
    };

    window.saveCallback = function(resp) {
        save(resp);
    };

    window.slackCallback = function(resp) {
        slack(resp);
    };

    $(window).on('hashchange', function(e){
        window.history.pushState("", document.title, window.location.pathname);
    });

    $.ajax({
        type:'GET',
        url: '/versions',
        contentType: 'application/json',
        success: function(data, status, jqXHR) {
            if(jqXHR.status === 200) {
                console.log(data, typeof data);
                data.releases.forEach(function(tag) {
                    var select = document.getElementById('version-select');
                    var option = document.createElement("option");
                    option.text = tag;
                    option.value = tag;
                    select.add(option);
                })
            }
        }
    });

};

function loadJSONata(version, isBranch)
{
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    var label = document.getElementById('version-label');
    script.type= 'text/javascript';
    if(version === 'local') {
        script.src = 'scripts/jsonata/jsonata.js';
        label.innerHTML = '** Local **';
        this.local = true;
    } else if(isBranch) {
        script.src = 'https://rawgit.com/jsonata-js/jsonata/' + version + '/jsonata.js';
        label.innerHTML = '** ' + version + ' **';
    } else {
        script.src = 'https://cdn.jsdelivr.net/npm/jsonata@' + version + '/jsonata.min.js';
        label.innerHTML = version;
        this.local = false;
    }
    head.appendChild(script);
}

function jcommand(command) {
    var tag, msg;
    if(command.indexOf('branch ') === 0) {
        tag = command.substring(7);
        loadJSONata(tag, true);
        msg = 'Using experimental branch: ' + tag;
    } else if(command.indexOf('use ') === 0) {
        tag = command.substring(4);
        if(jsonataVersions[tag]) {
            loadJSONata(jsonataVersions[tag]);
            msg = 'Using JSONata: ' + tag;
        } else {
            msg = 'Not supported: ' + tag;
        }
    } else {
        msg = 'Unknown command: ' + command;
    }
    path.setValue('');
    result.setValue(msg);
}

function eval() {
    var str;
    jsonataResult = undefined;
    jsonataError = undefined;

    try {
        str = source.getValue();
        str = JSON.parse(str);
    } catch (err) {
        console.log(err);
        result.setOption('mode', 'text/plain');
        result.setValue('ERROR IN INPUT DATA: ' + err.message);
        return;
    }
    //console.log(str);

    var pth = path.getValue();
    console.log(pth);

    if(pth.indexOf('J:') === 0 && pth.indexOf('\n') === pth.length - 1) {
        jcommand(pth.substring(2, pth.length - 1));
        return;
    }

    if(errorMark) {
        errorMark.clear();
        errorMark = undefined;
    }

    try {
        if (pth !== "") {
            path.setOption('mode', {name: 'jsonata', jsonata: window.jsonata});
            jsonataResult = evalJsonata(str);

            result.setOption('mode', 'javascript');
            result.setValue(jsonataResult);
        }
    } catch (err) {
        jsonataError = err;
        result.setOption('mode', 'text/plain');
        result.setValue(err.message || String(err));
        console.log(err);
        errorMark = path.markText({line: 0, ch: err.position - 1}, {line: 0, ch: err.position}, {css: "background-color: pink"});
    }

}

/**
 * Protect the process/browser from a runnaway expression
 * i.e. Infinite loop (tail recursion), or excessive stack growth
 *
 * @param {Object} expr - expression to protect
 * @param {Number} timeout - max time in ms
 * @param {Number} maxDepth - max stack depth
 */
function timeboxExpression(expr, timeout, maxDepth) {
    var depth = 0;
    var time = Date.now();

    var checkRunnaway = function() {
        if(depth > maxDepth) {
            // stack too deep
            throw {
                code: 'U1001',
                message: 'Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.',
                stack: (new Error()).stack
            };
        }
        if(Date.now() - time > timeout) {
            // expression has run for too long
            throw {
                code: 'U1002',
                message: "Expression evaluation timeout: Check for infinite loop",
                stack: (new Error()).stack
            };
        }

    };

    // register callbacks
    expr.assign('__evaluate_entry', function(expr, input, environment) {
        depth++;
        checkRunnaway();
    });
    expr.assign('__evaluate_exit', function(expr, input, environment, result) {
        depth--;
        checkRunnaway();
    });
}

function evalJsonata(input) {
    var expr = window.jsonata(path.getValue());

    // the following uses the 'moment' package to provide date/time support
    expr.assign('moment', function (arg1, arg2, arg3, arg4) {
        return moment(arg1, arg2, arg3, arg4);
    });

    expr.assign('trace', function(arg) {
       console.log(arg);
    });

    if(!this.local) {
        timeboxExpression(expr, 1000, 500);
    }

    var pathresult = expr.evaluate(input);
    if (typeof pathresult === 'undefined') {
        pathresult = '** no match **';
    } else {
        pathresult = JSON.stringify(pathresult, function (key, val) {
            return (typeof val !== 'undefined' && val !== null && val.toPrecision) ? Number(val.toPrecision(13)) :
                (val && (val._jsonata_lambda === true || val._jsonata_function === true)) ? '{function:' + (val.signature ? val.signature.definition : "") + '}' :
                    (typeof val === 'function') ? '<native function>#' + val.length  : val;
        }, 2);
    }
    return pathresult;
}

function save(resp) {
    // post the input data and jsonata
    var input;
    try {
        input = JSON.parse(source.getValue());
    } catch(err) {}
    var body = {
        input: input,
        jsonata: path.getValue(),
        recaptcha: resp
    };
    if(typeof jsonataResult !== 'undefined') {
        body.result = jsonataResult;
    }
    if(typeof jsonataError !== 'undefined') {
        body.error = jsonataError;
    }

    $.ajax({
        type:'POST',
        url: '/save',
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: function(data, status, jqXHR) {
            if(jqXHR.status === 201) {
                // created
                var location = jqXHR.getResponseHeader('location');
                var msg = 'Share this link: <a href="' + location + '">' + location + '</a>';
                document.getElementById("share-msg").innerHTML = msg;
                document.getElementById("share-title").innerHTML = 'Expression saved!';
                document.getElementsByClassName("verify")[0].style.display = 'none';
                document.getElementsByClassName("verify")[1].style.display = 'none';
            }
        }
    });
}

function slack(resp) {
    // post the input data and jsonata
    var email;
    try {
        email = document.getElementById("slack-email").value;
        console.log(email)
    } catch(err) {}
    var body = {
        email: email,
        recaptcha: resp
    };
    $.ajax({
        type:'POST',
        url: '/slack',
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: function(data, status, jqXHR) {
            if(jqXHR.status === 201) {
                // created
                document.getElementById("slack-title").innerHTML = 'Invitation sent!';
                document.getElementsByClassName("verify")[0].style.display = 'none';
                document.getElementsByClassName("verify")[1].style.display = 'none';
            } else {
                console.log(data);
                document.getElementById("slack-title").innerHTML = data;
            }
        },
    });
}

var data1value = {
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

function data1() {
    var value = JSON.stringify(data1value, null, 2);
    source.setValue(value);
    path.setValue("Account.Order[0].OrderID");
}

function data2() {
    var value = JSON.stringify({
  "FirstName": "Fred",
  "Surname": "Smith",
  "Age": 28,
  "Address": {
    "Street": "Hursley Park",
    "City": "Winchester",
    "Postcode": "SO21 2JN"
  },
  "Phone": [
    {
      "type": "home",
      "number": "0203 544 1234"
    },
    {
      "type": "office",
      "number": "01962 001234"
    },
    {
      "type": "office",
      "number": "01962 001235"
    },
    {
      "type": "mobile",
      "number": "077 7700 1234"
    }
  ],
  "Email": [
    {
      "type": "office",
      "address": ["fred.smith@my-work.com", "fsmith@my-work.com"]
    },
    {
      "type": "home",
      "address": ["freddy@my-social.com", "frederic.smith@very-serious.com"]
    }
  ],
  "Other": {
    "Over 18 ?": true,
    "Misc": null,
    "Alternative.Address": {
      "Street": "Brick Lane",
      "City": "London",
      "Postcode": "E1 6RF"
    }
  }
}, null, 2);
    source.setValue(value);
    path.setValue("Surname");
}

var data3Schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "required": [
        "Account"
    ],
    "type": "object",
    "id": "file://input-schema.json",
    "properties": {
        "Account": {
            "required": [
                "Order"
            ],
            "type": "object",
            "properties": {
                "Customer": {
                    "required": [
                        "First Name",
                        "Surname"
                    ],
                    "type": "object",
                    "properties": {
                        "First Name": {
                            "type": "string"
                        },
                        "Surname": {
                            "type": "string"
                        }
                    }
                },
                "AccID": {
                    "type": "string"
                },
                "Order": {
                    "items": {
                        "required": [
                            "OrderID",
                            "Product"
                        ],
                        "type": "object",
                        "properties": {
                            "OrderID": {
                                "type": "string"
                            },
                            "Product": {
                                "items": {
                                    "required": [
                                        "ProductID",
                                        "Product Name",
                                        "Price",
                                        "Quantity"
                                    ],
                                    "type": "object",
                                    "properties": {
                                        "SKU": {
                                            "type": "string"
                                        },
                                        "Description": {
                                            "type": "object",
                                            "properties": {
                                                "Width": {
                                                    "type": "integer"
                                                },
                                                "Depth": {
                                                    "type": "integer"
                                                },
                                                "Weight": {
                                                    "type": "number"
                                                },
                                                "Colour": {
                                                    "type": "string"
                                                },
                                                "Material": {
                                                    "type": "string"
                                                },
                                                "Height": {
                                                    "type": "integer"
                                                }
                                            }
                                        },
                                        "Product Name": {
                                            "type": "string"
                                        },
                                        "Price": {
                                            "type": "number"
                                        },
                                        "Quantity": {
                                            "type": "integer"
                                        },
                                        "ProductID": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                "type": "array"
                            }
                        }
                    },
                    "type": "array"
                },
                "Account Name": {
                    "type": "string"
                },
                "Address": {
                    "required": [
                        "Address Line 1",
                        "City",
                        "Postcode"
                    ],
                    "type": "object",
                    "properties": {
                        "Address Line 1": {
                            "type": "string"
                        },
                        "Address Line 2": {
                            "type": "string"
                        },
                        "Postcode": {
                            "type": "string"
                        },
                        "City": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    }
};

function data3() {
    var value = JSON.stringify(data3Schema, null, 2);
    source.setValue(value);
    path.setValue("properties");
}

