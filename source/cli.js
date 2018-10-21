#! /usr/bin/env node

const path = require('path')
const childProcess = require('child_process')
const crypto = require('crypto')
const nativeConsole = require('console')
const log = new nativeConsole.Console(process.stdout, process.stderr)

const fsp = require('fs-extra')
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
        [--output-directory <directory>] \\
        [--logo <*.png>] \\
        [--debug] \\
        --data <*.yaml> `
    )
    return
  }

  const dataFilePath = path.resolve(argv.data)
  const idMatch = path
    .basename(dataFilePath)
    .match(/^(\d{4}(-\d\d){2}(?:_\d+)?)(_|\.|$)/)
  const invoiceId = idMatch ? idMatch[1] : null

  fsp
    .readFile(dataFilePath)
    .then(yamlFileContent => {
      const data = yaml.safeLoad(yamlFileContent)
      data.id = invoiceId

      if (data.biller) {
        if (typeof data.biller === 'string') {
          data.billerPath = `~/Contacts/${data.biller}.yaml`
        }
      }
      if (data.recipient) {
        if (typeof data.recipient === 'string') {
          data.recipientPath = `~/Contacts/${data.recipient}.yaml`
        }
      }

      if (argv.biller) data.billerPath = path.resolve(argv.biller)
      if (argv.recipient) data.recipientPath = path.resolve(argv.recipient)

      if (!data.biller && !data.billerPath) {
        throw new Error('Biller is not specified')
      }
      if (!data.recipient && !data.recipientPath) {
        throw new Error('Recipient is not specified')
      }

      const billerPromise = data.biller
        ? Promise.resolve(data.biller)
        : fsp
          .readFile(untildify(data.billerPath))
          .then(yaml.safeLoad)

      const recipientPromise = data.recipient
        ? Promise.resolve(data.recipient)
        : fsp
          .readFile(untildify(data.recipientPath))
          .then(yaml.safeLoad)

      // TODO: Use `path.resolve(argv.logo)` when LaTeX accepts absolute paths
      if (argv.logo) data.logoPath = path.normalize(argv.logo)

      return Promise
        .all([
          billerPromise,
          recipientPromise,
        ])
        .then(yamlFileContents => {
          const [biller, recipient] = yamlFileContents
          const markdownInvoice = compileMarkdown(biller, recipient, data)

          return markdownInvoice
        })
    })
    .then(markdownInvoice => {
      if (!argv.output && !argv.outputDirectory) {
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
        '--pdf-engine', 'xelatex',
        '--out',
        argv.output || `${path.join(argv.outputDirectory, invoiceId)}.pdf`,
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
