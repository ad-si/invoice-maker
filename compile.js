'use strict'

const fs = require('fs')
const path = require('path')
const stream = require('stream')
const yaml = require('js-yaml')
const Tabledown = require('tabledown').default
const Yaml2json = require('@adius/yaml2json')
const templates = {
	de: require('./templates/de.js'),
	en: require('./templates/en.js'),
}
const billerFilePath = path.join(__dirname, 'biller.yaml')
const biller = yaml.safeLoad(fs.readFileSync(billerFilePath))
const alignments = {
	number: 'right',
	date: 'center',
	description: 'left',
	'duration (min)': 'right',
	'price (€)': 'right',
}


function formatTask (task, index) {
	const price = ((task.duration / 60) * 15)
	return {
		'number': index + 1,
		// Replace hyphen-minus with hyphen
		// Date: task.date.toISOString().substr(0,10).replace(/-/g, '‑'),
		'description': task.description,
		'duration (min)': Number.isFinite(task.duration) ? task.duration : '',
		'price (€)': Number.isFinite(price) ? price : task.price,
	}
}

process.stdin
	.pipe(new Yaml2json)
	.pipe(new stream.Transform({
		writableObjectMode: true,
		transform: function (chunk, encoding, done) {
			this.buffer = chunk
			done()
		},
		flush: function (done) {

			this.buffer.issuingDate = new Date()
			this.buffer.id = this.buffer.issuingDate
				.toISOString().substr(0, 10) + '_1'
			this.buffer.deliveryDate = this.buffer.deliveryDate ||
				this.buffer.issuingDate

			this.buffer.from = biller

			this.buffer.dueDate = new Date(this.buffer.issuingDate)
			this.buffer.dueDate.setDate(this.buffer.issuingDate.getDate() + 14)

			this.buffer.language = this.buffer.language || 'en'

			if (this.buffer.tasks) {
				this.buffer.tasks = this.buffer.tasks
					.reverse()
					.map(formatTask)

				this.buffer.taskTable = new Tabledown({
					data: this.buffer.tasks,
					capitalizeHeaders: true,
					alignments,
				})

				this.buffer.total = this.buffer.tasks.reduce(
					(sum, current) => sum + Number(current['price (€)']),
					0
				)
			}

			this.push(templates[this.buffer.language](this.buffer) + '\n')
			done()
		}
	}))
	.pipe(process.stdout)
