#! /usr/bin/env node

const path = require('path')
const childProcess = require('child_process')
const crypto = require('crypto')
const nativeConsole = require('console')
const log = new nativeConsole.Console(process.stdout, process.stderr)

const fsp = require('fs-promise')
const yaml = require('js-yaml')
const yargsParser = require('yargs-parser')
const untildify = require('untildify')

const compileMarkdown = require('./compileMarkdown')

const argv = yargsParser(process.argv.slice(2))

if (!argv.data) {
  log.error(
    `Usage: invoice-maker \\
      [--biller <*.yaml>] \\
      [--recipient <*.yaml>] \\
      [--output <*.pdf>] \\
      --data <*.yaml> `
  )
  process.exit(1)
}
else {

  const dataFilePath = path.resolve(argv.data)
  const idMatch = path
    .basename(dataFilePath)
    .match(/^(\d{4}(-\d\d){2}_\d+)_/)
  const invoiceId = idMatch ? idMatch[1] : null

  fsp
    .readFile(dataFilePath)
    .then(yamlFileContent => {
      const data = yaml.safeLoad(yamlFileContent)

      data.id = invoiceId

      if (data.biller) data.biller = `~/Contacts/${data.biller}.yaml`
      if (data.recipient) data.recipient = `~/Contacts/${data.recipient}.yaml`

      if (argv.biller) data.biller = path.resolve(argv.biller)
      if (argv.recipient) data.recipient = path.resolve(argv.recipient)

      if (!data.biller) throw new Error('Biller is not specified')
      if (!data.recipient) throw new Error('Recipient is not specified')

      return Promise
        .all([
          fsp.readFile(untildify(data.biller)),
          fsp.readFile(untildify(data.recipient)),
        ])
        .then(yamlFileContents => {
          const biller = yaml.safeLoad(yamlFileContents[0])
          const recipient = yaml.safeLoad(yamlFileContents[1])
          const markdownInvoice = compileMarkdown(biller, recipient, data)

          return markdownInvoice
        })
    })
    .then(markdownInvoice => {
      if (!argv.output) {
        log.info(markdownInvoice)
        return
      }

      const tempFileName = crypto
        .randomBytes(5)
        .toString('hex') + '.tmp'

      fsp.writeFileSync(tempFileName, markdownInvoice)

      childProcess.exec(
        `pandoc ${tempFileName}\
          --standalone \
          --latex-engine xelatex \
          --out ${argv.output}`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            if (error) log.error(error.stack)
            if (stderr) log.error(stderr)
          }
          else {
            fsp.unlinkSync(tempFileName)
            if (stdout) log.info(stdout)
          }
        }
      )
    })
    .catch(error => log.error(error.stack))
}
