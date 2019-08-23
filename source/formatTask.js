module.exports = (item, headerStructure, index) => {
  return Object.assign(
    {},
    headerStructure,
    {number: index + 1},
    item,
    {
      date: item.date
        .toISOString()
        .substr(0, 10)
        .replace(/-/g, '‑'), // Replace hyphen-minus with hyphen
      description: item.description.trim(),
    },
    Number.isFinite(item.duration)
      ? {duration: item.duration}
      : {}
  )
}
