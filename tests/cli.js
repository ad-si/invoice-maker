const nativeConsole = require('console')
const log = new nativeConsole.Console(process.stdout, process.stderr)
const childProcess = require('child_process')
const command =
`./source/cli.js \
  --biller tests/biller.yaml \
  --recipient tests/recipient.yaml \
  --data tests/invoice.yaml \
  --logo images/wordmark.png \
  --output tests/invoice.pdf
`

childProcess.exec(command, (error, stdout, stderr) => {
  log.assert(!error, error)
  log.assert(!stderr, stderr)
  log.assert(!stdout, stdout)

  log.log('All tests passed ✔')
})
