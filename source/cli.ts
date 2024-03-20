#! /usr/bin/env bun run

import * as fsp from "node:fs/promises"
import path from "path"
import childProcess from "child_process"
import crypto from "crypto"
import nativeConsole from "console"

import yaml from "js-yaml"
import yargsParser from "yargs-parser"
import untildify from "untildify"

import compileMarkdown from "./compileMarkdown.ts"
import type { FromContact, InvoiceData, ToContact } from "./types.ts"

const log = new nativeConsole.Console(process.stdout, process.stderr)
const argv = yargsParser(process.argv.slice(2))

async function main () {
  if (!argv.data) {
    log.error(
      `Usage: invoice-maker \\
        [--biller <*.yaml>] \\
        [--recipient <*.yaml>] \\
        [--output <*.pdf>] \\
        [--output-directory <directory>] \\
        [--logo <*.png>] \\
        [--debug] \\
        --data <*.yaml> `,
    )
    return
  }

  const dataFilePath = path.resolve(argv.data)
  const outFileName = path.basename(dataFilePath, path.extname(dataFilePath))
  const invoiceId = /_/.test(outFileName)
    ? outFileName.split("_")[0]
    : `${new Date()
      .toISOString()
      .replaceAll(/:/g, "")
      .slice(0, 17)}_outFileName` //
      .replace(/-/g, "‑") // Replace hyphen-minus with hyphen

  const yamlFileContent = await fsp.readFile(dataFilePath)
  const data = yaml.load(yamlFileContent.toString()) as InvoiceData

  data.id = invoiceId

  if (data.biller) {
    if (typeof data.biller === "string") {
      data.billerPath = `~/Contacts/${data.biller}.yaml`
    }
  }
  if (data.recipient) {
    if (typeof data.recipient === "string") {
      data.recipientPath = `~/Contacts/${data.recipient}.yaml`
    }
  }

  if (argv.biller) data.billerPath = path.resolve(argv.biller)
  if (argv.recipient) data.recipientPath = path.resolve(argv.recipient)

  if (!data.biller && !data.billerPath) {
    throw new Error("Biller is not specified")
  }
  if (!data.recipient && !data.recipientPath) {
    throw new Error("Recipient is not specified")
  }

  const billerPromise: Promise<FromContact> = data.biller
    ? (Promise.resolve(data.biller) as Promise<FromContact>)
    : (fsp
      .readFile(untildify(data.billerPath))
      .then((buffer) => yaml.load(buffer.toString())) as Promise<FromContact>)

  const recipientPromise: Promise<ToContact> = data.recipient
    ? (Promise.resolve(data.recipient) as Promise<ToContact>)
    : (fsp
      .readFile(untildify(data.recipientPath))
      .then((buffer) => yaml.load(buffer.toString())) as Promise<ToContact>)

  // TODO: Use `path.resolve(argv.logo)` when LaTeX accepts absolute paths
  if (argv.logo) data.logoPath = path.normalize(argv.logo)

  const yamlFileContents = await Promise.all([billerPromise, recipientPromise])

  const [biller, recipient]: [FromContact, ToContact] = yamlFileContents
  const markdownInvoice = compileMarkdown(biller, recipient, data)

  if (!argv.output && !argv.outputDirectory) {
    log.info(markdownInvoice)
    return
  }
  const timeStamp = new Date()
    .toISOString()
    .replace(/:/g, "")
    .slice(0, 15)
  const randBytes = crypto.randomBytes(2)
    .toString("hex")
  const tempFileName = `${timeStamp}_${randBytes}.tmp.md`

  await fsp.writeFile(tempFileName, markdownInvoice)

  const args = [
    tempFileName,
    "--standalone",
    ["--pdf-engine", "xelatex"],
    "--out",
    argv.output || `${path.join(argv.outputDirectory, outFileName)}.pdf`,
  ].flat()

  log.info(`Run "pandoc ${args.join(" ")}"`)

  childProcess.execFile(
    "pandoc",
    args,
    async (error: Error | null, stdout: string, stderr: string) => {
      if (error || stderr) {
        if (error) log.error(error.stack)
        if (stderr) log.error(stderr)
      }

      if (stdout) log.info(stdout)

      if (!error && !argv.debug) {
        await fsp.unlink(tempFileName)
      }
    },
  )
}

main()
