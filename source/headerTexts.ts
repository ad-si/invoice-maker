// Add trailing spaces to adjust width of columns in output table
export default {
  en: {
    // TODO: Remove space after № when
    // https://github.com/ad-si/tabledown/issues/4 is fixed
    number: "№ ",
    date: `Date${" ".repeat(5)}`,
    description: `Description${" ".repeat(50)}`, // TODO: Set dynamically
    duration: "Duration (min)",
    quantity: "Quantity",
    price: "Price (€)",
    priceTotal: "Total (€)",
  },
  de: {
    number: "Nr.",
    date: `Datum${" ".repeat(5)}`,
    description: `Beschreibung${" ".repeat(50)}`, // TODO: Set dynamically
    duration: "Dauer (min)",
    quantity: "Anzahl",
    price: "Preis (€)",
    priceTotal: "Gesamt (€)",
  },
}
