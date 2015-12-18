'use strict'

let stream = require('stream')
let Yaml2json = require('@adius/yaml2json')
let template = require('./template.js')
let me = require('./me.json')


function buildTaskTable (tasks) {
	let returnString = ''

	tasks = tasks.map((task, index) => {
		return {
			number: index + 1,
			date: task.date
				.toISOString()
				.substr(0,10),
			description: task.description
		}
	})

	let headerFields = Object.keys(
		tasks.reduce(
			(object, current) => {
				Object.keys(current)
					.forEach(key => object[key] = true)
				return object
			},
			{}
		)
	)


	let maxFieldLengths = tasks
		.reduce(
			(maxFieldLengths, task) => {
				headerFields.forEach(field => {
					if (task.hasOwnProperty(field)) {
						let fieldLength = String(task[field]).length

						if (!maxFieldLengths[field])
							maxFieldLengths[field] = 0

						if (fieldLength > maxFieldLengths[field]) {
							maxFieldLengths[field] = fieldLength
						}
					}
				})
				return maxFieldLengths
			},
			headerFields.reduce(
				(headerFieldLength, field) => {
					headerFieldLength[field] = String(field).length
					return headerFieldLength
				},
				{}
			)
		)

	let paddedHeaderFields = headerFields.map(field => {
		return field + ' '.repeat(
			maxFieldLengths[field] - String(field).length
		)
	})

	tasks = tasks.map(task => {
		headerFields.forEach((field, index) => {
			if (task.hasOwnProperty(field)) {
				let fieldLength = String(task[field]).length
				task[field] += ' '
					.repeat(maxFieldLengths[field] - fieldLength)
			}
		})
		return task
	})

	returnString += paddedHeaderFields.join(' ') + '\n'

	returnString += paddedHeaderFields
		.map(field => '-'.repeat(field.length))
		.join(' ')

	returnString += '\n'

	returnString += tasks
		.map(task =>
			[
				task.number,
				task.date,
				task.description
			].join(' ')
		)
		.join('\n')

	return returnString
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
			this.buffer.from = me

			this.buffer.date = this.buffer.id.substr(0, 10)

			this.buffer.dueDate = new Date(this.buffer.date)
			this.buffer.dueDate
				.setDate(this.buffer.dueDate.getDate() + 20)
			this.buffer.dueDate = this.buffer.dueDate
				.toISOString()
				.substr(0, 10)


			if (this.buffer.tasks) {
				this.buffer.taskTable = buildTaskTable(
					this.buffer.tasks
				)
			}

			this.push(template(this.buffer) + '\n')
			done()
		}
	}))
	.pipe(process.stdout)
