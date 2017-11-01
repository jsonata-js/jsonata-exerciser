/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

/*
 * GET home page.
 */

exports.index = function(req, res){
  var inserts = {
    input: req.body.input,
    jsonata: req.body.jsonata
  };
  res.render('index.html', inserts);
};