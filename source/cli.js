#! /usr/bin/env node

'use strict'

const path = require('path')
const childProcess = require('child_process')
const crypto = require('crypto')

const fsp = require('fs-promise')
const yaml = require('js-yaml')
const yargsParser = require('yargs-parser')

const compileMarkdown = require('./compileMarkdown')

const argv = yargsParser(process.argv.slice(2))

if (!argv.biller || !argv.recipient || !argv.data || !argv.output) {
	console.error(
		'Usage: invoice-maker ' +
		'--biller <*.yaml> ' +
		'--recipient <*.yaml> ' +
		'--data <*.yaml> ' +
		'--output <*.pdf>'
	)
	process.exit(1)
	return
}

Promise
	.all([
		fsp.readFile(path.resolve(argv.biller)),
		fsp.readFile(path.resolve(argv.recipient)),
		fsp.readFile(path.resolve(argv.data))
	])
	.then(yamlFileContents => {
		const biller = yaml.safeLoad(yamlFileContents[0])
		const recipient = yaml.safeLoad(yamlFileContents[1])
		const data = yaml.safeLoad(yamlFileContents[2])

		const markdownInvoice = compileMarkdown(biller, recipient, data)
		const tempFileName = crypto.randomBytes(5).toString('hex') + '.tmp'

		fsp.writeFileSync(tempFileName, markdownInvoice)

		childProcess.exec(
			`pandoc ${tempFileName}\
				--standalone \
				--latex-engine xelatex \
				--out ${argv.output}`,
			(error, stdout, stderr) => {
				if (error || stderr) {
					if (error) console.error(error.stack)
					if (stderr) console.error(stderr)
				}
				else {
					fsp.unlinkSync(tempFileName)
					if (stdout) console.log(stdout)
				}
			}
		)
	})
	.catch(error => console.error(error.stack))
