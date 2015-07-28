var nconf = require('nconf');

nconf
  .argv()
	.env('_')
	.file({
		file: process.cwd() + '/config.json'
	});

module.exports = nconf;
