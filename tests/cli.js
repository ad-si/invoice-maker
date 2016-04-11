'use strict'

const fs = require('fs')
const childProcess = require('child_process')
const command =
`./source/cli.js \
	--biller tests/biller.yaml \
	--recipient tests/recipient.yaml \
	--data tests/invoice.yaml \
	--output tests/invoice.pdf
`

childProcess.exec(command, (error, stdout, stderr) => {
	console.assert(!error, error)
	console.assert(!stderr, stderr)
	console.assert(!stdout, stdout)
})
