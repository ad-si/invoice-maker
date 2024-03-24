#import "../invoice-maker.typ": *
#import "../fixtures/example-data.typ": *

#show: invoice.with(
  language: "en",
  banner-image: image("../fixtures/banner.png"),
  invoice-id: "2024-03-10t172205",
  issuing-date: "2024-03-10",
  delivery-date: "2024-02-29",
  due-date: "2024-03-20",
  hourly-rate: 100,
  discount: (
    value: 350,
    type: "fixed",
    reason: "Delayed delivery",
  ),
  biller: biller,
  recipient: recipient,
  items: table-data,
)
