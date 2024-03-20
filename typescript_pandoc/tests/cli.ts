import nativeConsole from "console"
import childProcess from "child_process"

const log = new nativeConsole.Console(process.stdout, process.stderr)
const command = `./source/cli.ts \
  --biller tests/biller.yaml \
  --recipient tests/recipient.yaml \
  --data tests/invoice-$LANGUAGE.yaml \
  --logo images/wordmark.png \
  --output tests/invoice-$LANGUAGE.pdf
`

childProcess.exec(
  command.replace(/invoice-\$LANGUAGE\./g, "invoice-en."),
  (error, stdout, stderr) => {
    log.assert(!error, error, "ERROR: There was an error (English invoice PDF)")
    const stderrNorm = stderr
      .split("\n")
      .filter((msg) => !msg.includes("Missing character"))
      .join("\n")
      .trim()
    log.assert(
      !stderrNorm,
      stderrNorm,
      "ERROR: Something was written to stderr (English invoice PDF)",
    )
    log.assert(
      stdout,
      "ERROR: Nothing was written to stdout (English invoice PDF)",
    )

    log.log("Create English invoice PDF ✔")
  },
)

childProcess.exec(
  command.replace(/invoice-\$LANGUAGE\./g, "invoice-de."),
  (error, stdout, stderr) => {
    log.assert(!error, error)
    log.assert(!stderr, stderr)
    log.assert(stdout)

    log.log("Create German invoice PDF ✔")
  },
)
