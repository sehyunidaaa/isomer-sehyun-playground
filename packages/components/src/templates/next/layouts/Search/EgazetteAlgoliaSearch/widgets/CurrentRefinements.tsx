import { BiX } from "react-icons/bi"
import { useCurrentRefinements } from "react-instantsearch"

import { EGAZETTE_CATEGORIES } from "../categories"

export const CurrentRefinements = () => {
  // Year/month are surfaced through the range inputs; don't duplicate them as
  // removable chips here. "query" stays excluded to match the default behavior.
  const { items, refine } = useCurrentRefinements({
    excludedAttributes: ["query", "publishYear", "publishMonth"],
  })

  if (items.length === 0) return null

  const labelLookup = new Map<string, string>()
  EGAZETTE_CATEGORIES.forEach((category) => {
    labelLookup.set(category.value, category.displayLabel)
    category.subCategories?.forEach((sub) => {
      labelLookup.set(sub.value, sub.displayLabel)
    })
  })

  return (
    <ul className="flex flex-wrap gap-2">
      {items.flatMap((group) =>
        group.refinements.map((refinement) => {
          const display =
            labelLookup.get(String(refinement.value)) ?? refinement.label
          return (
            <li
              key={`${group.attribute}-${refinement.value}`}
              className="prose-body-sm inline-flex items-center gap-1 rounded-full border border-base-content-strong bg-white px-3 py-1 text-base-content transition-colors hover:bg-base-canvas-backdrop/50"
            >
              {display}
              <button
                type="button"
                onClick={() => refine(refinement)}
                className="inline-flex items-center rounded-full transition-colors active:bg-base-canvas-backdrop/80"
              >
                <BiX aria-hidden className="h-4 w-4" />
                <span className="sr-only">Remove filter</span>
              </button>
            </li>
          )
        }),
      )}
    </ul>
  )
}
