import Tabledown from "tabledown"
import formatTask from "./formatTask.ts"
import headerTexts from "./headerTexts.ts"
import {
  Address,
  FromContact,
  Invoice,
  Item,
  ToContact,
  YamlData,
} from "./types.ts"

const alignments: {
  number: string
  date: string
  description: string
  duration?: string
  quantity?: string
  price: string
  priceTotal?: string
} = {
  number: "center",
  date: "center",
  description: "left",
  duration: "right",
  quantity: "right",
  price: "right",
  priceTotal: "right",
}

function sanitizeContact (contact: FromContact | ToContact): {
  address: Address
  email: string
  smallBusiness: boolean
  name: string
  iban: string
  "umsatzsteuer-identifikationsnummer"?: string
} {
  const emptyAddress = {
    country: "",
    city: "",
    zip: "",
    street: "",
    number: "",
    addition: "",
  }
  const email = contact?.email || contact.emails?.[0] || ""
  const address = Object.assign(
    {},
    emptyAddress,
    contact.address || contact.addresses?.[0] || {},
  )

  return {
    email,
    address,
    smallBusiness: contact.smallBusiness,
    name: contact.name,
    iban: contact.iban || "",
    "umsatzsteuer-identifikationsnummer":
      contact["umsatzsteuer-identifikationsnummer"],
  }
}

function getSubTotal (items: Item[]) {
  return items
    .map((item) => Number(item.priceTotal))
    .reduce((current, next) => current + next)
}

function calcDeliveryDateFromItems (items: Item[]) {
  return items
    .map((item) => item.date || new Date(0))
    .reduce(
      (previousDate, currentDate) =>
        previousDate > currentDate ? previousDate : currentDate,
      new Date(0),
    )
}

function buildTaskTable (data: YamlData, items: Item[]) {
  const headerStructure: Record<string, string> = {}
  const headerTextsLocal: Record<string, string> = headerTexts[data.language]

  const usesDuration = items.some((item) => Boolean(item.duration))
  const usesQuantity = items.some((item) => (item.quantity || 0) > 1)

  Object.keys(headerTexts[data.language])
    .forEach(
      (key: string) => headerStructure[key] = "",
    )

  if (!usesDuration) {
    delete headerStructure.duration
    delete headerTextsLocal.duration
    delete alignments.duration
  }

  if (!usesQuantity) {
    delete headerStructure.quantity
    delete headerTextsLocal.quantity
    delete alignments.quantity

    delete headerStructure.priceTotal
    delete headerTextsLocal.priceTotal
    delete alignments.priceTotal
  }

  const formattedItems = items
    .map((item) => {
      if (!usesDuration) {
        delete item.duration
      }
      if (!usesQuantity) {
        delete item.quantity
        delete item.priceTotal
      }

      if (typeof item.price === "number") {
        item.price = item.price.toFixed(2)
      }
      if (typeof item.priceTotal === "number") {
        item.priceTotal = item.priceTotal.toFixed(2)
      }

      if (item.duration === null || item.duration === undefined) {
        item.duration = 0
      }
      return item
    })
    .map((item, index) => formatTask(item, headerStructure, index))

  const table = new Tabledown({
    data: formattedItems,
    alignments,
    headerTexts: headerTextsLocal,
    capitalizeHeaders: true,
  })

  return table
}

export default function (
  biller: FromContact,
  recipient: ToContact,
  data: YamlData,
): Invoice {
  const invoice = {} as Invoice

  invoice.type = data.type || "invoice"
  invoice.issuingDate = data.issuingDate || new Date()
  invoice.id = data.id || invoice.issuingDate.toISOString()
    .slice(0, 10) + "_1"

  invoice.deliveryDate =
    data.deliveryDate || calcDeliveryDateFromItems(data.items)

  invoice.dueDate = new Date(invoice.issuingDate)
  invoice.dueDate.setDate(invoice.issuingDate.getDate() + 14)

  invoice.from = sanitizeContact(biller)
  invoice.to = sanitizeContact(recipient)

  invoice.language = data.language || "en"

  if (data.items) {
    invoice.items = data.items
      .map((item) => {
        item.date = item.date || invoice.deliveryDate
        item.quantity = Number.isFinite(item.quantity) ? item.quantity : 1

        if (item.price != null) {
          if (Number.isFinite(item.price)) {
            item.priceTotal = Number(item.price) * (item.quantity || 0)
          }
          else {
            throw new Error(
              `Price must be a valid number and not "${item.price}"`,
            )
          }
        }
        else if (item.duration != null) {
          const matches = String(item.duration)
            .match(/^([0-9]+) s$/i)
          if (matches && matches.length === 2) {
            item.duration = Number(matches[1]) / 60
          }

          if (Number.isFinite(item.duration)) {
            // minutes
            const hourlyWage = data.hourlyWage || 20 // $/hour
            const minutesPerHour = 60
            const price = (item.duration / minutesPerHour) * hourlyWage
            item.price = price
            item.priceTotal = price
          }
          else {
            throw new Error(
              `Duration must be a valid number and not "${item.duration}"`,
            )
          }
        }
        else {
          throw new Error("Set price or duration")
        }
        return item
      })
      .sort((itemA, itemB) => Number(itemA.date) - Number(itemB.date))

    invoice.total = invoice.subTotal = getSubTotal(invoice.items)

    if (data.discount) {
      if (data.discount.type === "fixed") {
        invoice.discount = data.discount
        invoice.discount.amount = data.discount.value
      }
      else if (data.discount.type === "proportionate") {
        invoice.discount = data.discount
        invoice.discount.amount = invoice.subTotal * invoice.discount.value
      }
      else {
        throw new Error(`"${data.discount.type} is no valid discount type"`)
      }

      invoice.total -= invoice.discount.amount
    }

    if (data.vat) {
      invoice.vat = data.vat
      invoice.tax = invoice.total * invoice.vat
      invoice.total += invoice.tax
    }

    invoice.logoPath = data.logoPath

    invoice.totalDuration = invoice.items
      .map((item) => Number(item.duration || 0))
      .reduce((current, next) => current + next)

    invoice.taskTable = buildTaskTable(data, invoice.items)
  }

  invoice.deliveryDate = new Date(invoice.deliveryDate || invoice.issuingDate)

  return invoice
}
