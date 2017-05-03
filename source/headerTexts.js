// Add trailing spaces to adjust width of columns in output table

module.exports = {
  en: {
    number: 'Number',
    date: 'Date',
    description: 'Description',
    duration: 'Duration (min)',
    price: 'Price ($)',
  },
  de: {
    number: 'Nummer',
    date: `Datum${' '.repeat(5)}`,
    description: `Beschreibung${' '.repeat(50)}`,
    duration: 'Dauer (min)',
    price: 'Preis (€)',
  },
}
