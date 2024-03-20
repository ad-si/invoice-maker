export type InvoiceData = {
  id: string
  language: "en" | "de"
  biller: string | Record<string, unknown>
  billerPath: string
  recipient: string | Record<string, unknown>
  recipientPath: string
  logoPath: string
  items: Item[]
}

export type Address = {
  addition: string
  country: string
  city: string
  zip: string
  street: string
  number: string
  flat?: string
}

export type Item = {
  date?: Date
  description: string
  duration?: number
  quantity?: number
  price?: number | string // TODO: Extra field for formatted price
  priceTotal?: number | string // TODO: Extra field for formatted price
}

type Discount = {
  type: "fixed" | "proportionate"
  value: number
  reason?: string
  amount: number
}

export type YamlData = {
  type?: "invoice" | "quote"
  id?: string
  issuingDate?: Date
  deliveryDate?: Date
  dueDate?: Date
  language: "en" | "de"
  items: Item[]
  discount?: Discount
  vat?: number
  hourlyWage?: number
  logoPath?: string
}

export type FromContact = {
  "umsatzsteuer-identifikationsnummer"?: string
  smallBusiness: boolean
  name: string
  iban: string
  email?: string
  emails?: string[]
  job?: string
  address: Address
  addresses?: Address[]
  vatin?: string
}

export type ToContact = {
  "umsatzsteuer-identifikationsnummer"?: string
  smallBusiness: boolean
  name: string
  iban?: string
  email?: string
  emails?: string[]
  organization?: string
  address: Address
  addresses?: Address[]
  vatin?: string
}

export type Invoice = {
  type?: "invoice" | "quote"
  language: "en" | "de"
  logoPath?: string
  id: string
  issuingDate: Date
  dueDate: Date
  deliveryDate: Date
  vatid?: string // TODO
  from: FromContact
  to: ToContact
  items: Item[]
  taskTable: string
  totalDuration: number
  discount?: Discount
  vat?: number
  tax: number
  subTotal: number
  total: number
}
