#import "../invoice-maker.typ": *

#show: invoice.with(
  hourly-rate: 1,
  language: (
    id: "es",
    country: "ES",
    recipient: "Destinatario",
    biller: "Emisor",
    invoice: "Factura",
    cancellation-invoice: "Factura de Cancelación",
    cancellation-notice: (id, issuing-date) => [
      Como acordado, recibirá una nota de crédito
      por la factura *#id* con fecha *#issuing-date*.
    ],
    invoice-id: "ID de Factura",
    issuing-date: "Fecha de Emisión",
    delivery-date: "Fecha de Entrega",
    items: "Ítems",
    closing: "¡Gracias por la buena cooperación!",
    number: "№",
    date: "Fecha",
    description: "Descripción",
    duration: "Duración",
    quantity: "Cantidad",
    price: "Precio",
    total-time: "Tiempo total de trabajo",
    subtotal: "Total parcial",
    discount-of: "Descuento de",
    vat: "IVA de",
    reverse-charge: "Inversión del Sujeto Pasivo",
    total: "Total",
    due-text: val =>
      [Por favor, transfiera el dinero a la siguiente
      cuenta bancaria antes de *#val*:],
    owner: "Propietario",
    iban: "IBAN",
  ),
  biller: (
    name: "ACME Corporation",
    vat-id: "GB123456789",
    iban: "GB29 NWBK 6016 1331 9268 19",
    address: (
      country: "United Kingdom",
      city: "London",
      street: "Abbey Road",
      postal-code: "NW8 0AE",
    ),
  ),
  recipient: (
    name: "John Doe",
    vat-id: "GB987654321",
    address: (
      country: "United Kingdom",
      city: "London",
      street: "Baker Street",
      postal-code: "W1U 6TJ",
    )
  ),
  items: (
    (
      date: "2024-03-20",
      description: "Minimal amount of work",
      price: 1,
    ),
  ),
  styling: ( font: none ), // Explicitly use Typst's default font
)
