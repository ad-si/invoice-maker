module.exports = (item, index) => {
	const price = ((item.duration / 60) * 15)
	return {
		number: index + 1,
		// Replace hyphen-minus with hyphen
		date: item.date.toISOString().substr(0,10).replace(/-/g, '‑'),
		description: item.description,
		duration: Number.isFinite(item.duration) ? item.duration : '',
		price: Number.isFinite(price) ? price : item.price,
	}
}
