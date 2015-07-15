#!/usr/bin/env node
'use strict';

var minimist = require('minimist')
  , fs       = require('fs')
  , path     = require('path')
  , exorcist = require('../')
  ;

function usage() {
  var usageFile = path.join(__dirname, 'usage.txt');
  fs.createReadStream(usageFile).pipe(process.stdout);
  return;
}

(function damnYouEsprima() {

var argv = minimist(process.argv.slice(2)
  , { boolean: [ 'h', 'help' ]
    , string: [ 'url', 'u', 'root', 'r', 'base', 'b' ]
  });

if (argv.h || argv.help) return usage();


var mapfile = argv._.shift();
if (!mapfile) {
  console.error('Missing map file');
  return usage();
}

var url     = argv.url    || argv.u
  , root    = argv.root   || argv.r
  , base    = argv.base   || argv.b
  , output  = argv._.shift() || false
  , input   = argv._.shift() || false;

mapfile = path.resolve(mapfile);

(input ? fs.createReadStream(input) : process.stdin)
  .pipe(exorcist(mapfile, url, root, base))
  .on('error', console.error.bind(console))
  .on('missing-map', console.error.bind(console))
  .pipe( output ? fs.createWriteStream(output) : process.stdout);

})()
