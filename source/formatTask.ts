import { Item } from "./types"

export default function (
  item: Item,
  headerStructure: Record<string, string>,
  index: number,
) {
  return Object.assign(
    {},
    headerStructure,
    { number: index + 1 },
    item,
    {
      date: item.date?.toISOString()
        .slice(0, 10)
        .replace(/-/g, "‑"), // Replace hyphen-minus with hyphen
      description: item.description.trim(),
    },
    Number.isFinite(item.duration) ? { duration: item.duration } : {},
  )
}
