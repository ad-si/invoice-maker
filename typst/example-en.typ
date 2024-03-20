#import "invoice-maker.typ": *
#import "example-data.typ": *

#show: invoice.with(
  language: "en",
  banner_image: image("banner.png"),
  invoice_id: "2024-03-10t172205",
  issuing_date: "2024-03-10",
  delivery_date: "2024-02-29",
  due_date: "2024-03-20",
  biller: biller,
  hourly_rate: 100,
  recipient: recipient,
  items: table_data,
)
