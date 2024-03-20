# Invoice Maker

Generate beautiful invoices from YAML files.

[![Example invoice](../images/example-invoice.png)](./tests/invoice-en.pdf)


## Installation

### Via npm

```sh
npm install https://github.com/ad-si/invoice-maker
```


### From Source

```sh
git clone https://github.com/ad-si/invoice-maker
bun run ./source/cli.ts
```


#### Via Docker

```sh
git clone https://github.com/ad-si/invoice-maker
cd invoice-maker
docker build .
docker run --rm -v "$PWD":/workdir .
```


## Usage

Run the command without any arguments to print the usage information:

```txt
$ invoice-maker
Usage: invoice-maker \
        [--biller <*.yaml>] \
        [--recipient <*.yaml>] \
        [--output <*.pdf>] \
        [--logo <*.png>] \
        [--debug] \
        --data <*.yaml>
```

E.g. to generate the example invoice you can run:

```sh
invoice-maker \
  --biller tests/biller.yaml \
  --recipient tests/recipient.yaml \
  --data tests/invoice-en.yaml \
  --logo ../images/wordmark.png \
  --output tests/invoice.pdf
```

Checkout the [tests](./tests) directory for more example files.


## Development

Run Tests:

```sh
make test
```
