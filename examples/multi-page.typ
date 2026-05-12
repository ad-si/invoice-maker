#import "../invoice-maker.typ": *
#import "../fixtures/example-data.typ": *

// Generate enough items to force a second page so that the
// "page X / Y" footer is rendered.
#let many-items = range(1, 41).map(i => (
  date: "2024-04-" + (if i < 10 { "0" + str(i) } else { str(i) }),
  description: "Service item " + str(i),
  quantity: 1,
  price: 100,
))

#show: invoice.with(
  language: "en",
  banner-image: image("../fixtures/banner.png"),
  invoice-id: "2024-04-30t120000",
  issuing-date: "2024-04-30",
  delivery-date: "2024-04-30",
  due-date: "2024-05-14",
  biller: biller,
  hourly-rate: 100,
  recipient: recipient,
  items: many-items,
  styling: ( font: none ),
)
