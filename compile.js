'use strict'

let stream = require('stream')
let Yaml2json = require('@adius/yaml2json')
let template = require('./template.js')
let me = require('./me.json')

process.stdin
	.pipe(new Yaml2json)
	.pipe(new stream.Transform({
		writableObjectMode: true,
		transform: function (chunk, encoding, done) {
			this.buffer = chunk
			done()
		},
		flush: function (done) {
			this.buffer.from = me
			this.buffer.taskTable = 
			this.push(template(this.buffer) + '\n')
			done()
		}
	}))
	.pipe(process.stdout)
