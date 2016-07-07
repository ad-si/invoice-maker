module.exports = (item, index) => {

  return Object.assign(
    {number: index + 1},
    item,
    {
      // Replace hyphen-minus with hyphen
      date: item.date
        .toISOString()
        .substr(0, 10)
        .replace(/-/g, '‑'),
      description: item.description.trim(),
      duration: Number.isFinite(item.duration) ? item.duration : '',
    }
  )
}
