#import "../invoice-maker.typ": *
#import "../fixtures/example-data.typ": *

#show: invoice.with(
  language: "en",
  banner-image: image("../fixtures/banner.png"),
  invoice-id: "2024-03-10t172205",
  issuing-date: "2024-03-10",
  delivery-date: "2024-02-29",
  due-date: "2024-03-20",
  biller: biller,
  hourly-rate: 100,
  recipient: recipient,
  items: table-data,
  styling: (
    font: none, // Explicitly use Typst's default font
    font-size: 8pt,
    margin: (
      top: 20mm,
      right: 40mm,
      bottom: 10mm,
      left: 40mm
    ),
  )
)

#horizontalrule

= Additional Information
#v(1em)

The body of the invoice can contain additional information,
such as a note to the recipient
or an extended description of the provided services.

This information is displayed at the bottom of the invoice.
