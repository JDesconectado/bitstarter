#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Use commander.js and cheerio. Teaches command line application development
and basic DOM parsing

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2

*/
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var HTMLFILE_DEFAULT = 'http://stormy-wildwood-4999.herokuapp.com';
var CHECKFILE_DEFAULT = 'checks.json';

var assertFileExists = function(infile){
	var instr = infile.toString();
	if(!fs.existsSync(instr)){
		console.log("%s does not exists. Exiting.", instr);
		process.exit(1);
	}
	return instr;
};

var loadChecks = function(checksfile){
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
	var htmlresponse = function(result, response){
		$ = cheerio.load(result);
		var checks = loadChecks(checksfile).sort();
		var out = {};
		for(var ii in checks){
			var present = $(checks[ii]).length > 0;
			out[checks[ii]] = present;
		}
		var outJson = JSON.stringify(out, null, 4);
		console.log(outJson);
	}
	return htmlresponse;
};


var clone = function(fn){
	return fn.bind({});
};

if(require.main == module) {
	program
	.option('-c, --checks <check_file>', 'Path to checks.json', 
		clone(assertFileExists), CHECKFILE_DEFAULT)
	.option('-u, --url <url>', 'Path to index.html',  HTMLFILE_DEFAULT)
	.parse(process.argv);
	var htmlresp = checkHtmlFile(program.url, program.checks);
	rest.get(program.url).on("complete", htmlresp);
}else {
	exports.checkHtmlFile = checkHtmlFile;
}

