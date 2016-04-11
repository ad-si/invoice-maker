'use strict'

const Tabledown = require('tabledown').default
const formatTask = require('./formatTask')
const headerTexts = require('./headerTexts')
const alignments = {
	number: 'center',
	date: 'center',
	description: 'left',
	duration: 'right',
	price: 'right',
}

module.exports = (biller, recipient, data) => {

	const invoice = {}

	invoice.issuingDate = new Date()
	invoice.id = invoice.issuingDate
		.toISOString().substr(0, 10) + '_1'
	invoice.deliveryDate = invoice.deliveryDate ||
		invoice.issuingDate

	invoice.from = biller
	invoice.to = recipient

	invoice.dueDate = new Date(invoice.issuingDate)
	invoice.dueDate.setDate(
		invoice.issuingDate.getDate() + 14
	)

	invoice.language = data.language || 'en'

	if (data.items) {
		invoice.items = data.items
			.reverse()
			.map(formatTask)

		invoice.taskTable = new Tabledown({
			data: invoice.items,
			alignments,
			headerTexts: headerTexts[data.language],
			capitalizeHeaders: true,
		})

		invoice.total = invoice.items.reduce(
			(sum, current) => sum + Number(current.price),
			0
		)
	}

	return invoice
}
