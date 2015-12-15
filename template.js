module.exports = (invoice) =>
`# ${invoice.from.name}

${invoice.for.name}
${invoice.for.address.country}
${invoice.for.address.city}
${invoice.for.address.street}

${
	invoice.tasks ?
		Object.keys(invoice.tasks
			.reduce(
				(object, current) => {
					Object.keys(current).forEach(key => object[key] = true)
					return object
				},
				{number: true}
			)
		).join(' | ') :
	''
}
---|---|---
${
	invoice.tasks ?
		invoice.tasks
			.map((task, index) =>
				[
					index + 1,
					task.date.toISOString().substr(0,10),
					task.description
				].join(' | ')
			)
			.join('\n') :
		''
}
`
