// Add trailing spaces to adjust width of columns in output table

module.exports = {
  en: {
    number: 'Number',
    date: `Date${' '.repeat(5)}`,
    description: `Description${' '.repeat(50)}`,
    duration: 'Duration (min)',
    quantity: 'Quantity',
    price: 'Price (€)',
    priceTotal: 'Total (€)',
  },
  de: {
    number: 'Nummer',
    date: `Datum${' '.repeat(5)}`,
    description: `Beschreibung${' '.repeat(50)}`,
    duration: 'Dauer (min)',
    quantity: 'Anzahl',
    price: 'Preis (€)',
    priceTotal: 'Gesamt (€)',
  },
}
