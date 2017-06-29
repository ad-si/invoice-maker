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

function main () {
  if (!argv.data) {
    log.error(
      `Usage: invoice-maker \\
        [--biller <*.yaml>] \\
        [--recipient <*.yaml>] \\
        [--output <*.pdf>] \\
        [--logo <*.png>] \\
        [--debug] \\
        --data <*.yaml> `
    )
    return
  }

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

      if (argv.logo) data.logoPath = path.resolve(argv.logo)

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
      const timeStamp = new Date()
        .toISOString()
        .replace(/:/g, '')
        .slice(0, 15)
      const randBytes = crypto
        .randomBytes(2)
        .toString('hex')
      const tempFileName =  `${timeStamp}_${randBytes}.tmp.md`

      fsp.writeFileSync(tempFileName, markdownInvoice)

      const args = [
        tempFileName,
        '--standalone',
        '--latex-engine', 'xelatex',
        '--out', argv.output,
      ]

      log.info(`Run "pandoc ${args.join(' ')}"`)

      childProcess.execFile('pandoc', args, (error, stdout, stderr) => {
        if (error || stderr) {
          if (error) log.error(error.stack)
          if (stderr) log.error(stderr)
        }
        else {
          if (!argv.debug) fsp.unlinkSync(tempFileName)
          if (stdout) log.info(stdout)
        }
      })
    })
    .catch(error => log.error(error.stack))
}

main()
