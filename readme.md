# Invoice Maker

Generate beautiful invoices from a simple data record.

<a href="./tests/invoice-en.pdf">
  <img
    alt="Example invoice"
    src="./images/example-invoice.png"
    style="max-height: 768px"
  >
</a>


## Installation

There are currently two different implementations:

- [Typst](https://www.docker.com) template
- [TypeScript + Pandoc](./typescript_pandoc/) npm package

The TypeScript + Pandoc package is the original implementation
and is now in maintenance mode.
The Typst template is the new implementation
and is the recommended way to use Invoice Maker.
(But doesn't support loading YAML files yet.)


## Usage

1. Download the [invoice-maker.typ](./typst/invoice-maker.typ) file
1. Create a new `invoice.typ` file. E.g. based on this:
    - [English example](./typst/example-en.typ)
    - [German example](./typst/example-de.typ)
1. Run typst to generate the invoice:
    ```sh
    typst compile invoice.typ
    ```
1. Open the generated `invoice.pdf` file.


## Development

Run Tests:

```sh
make test
```
