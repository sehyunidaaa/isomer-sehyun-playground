import { useCurrentRefinements, useRefinementList } from "react-instantsearch"

import {
  Checkbox,
  CheckboxGroup,
} from "../../../../components/internal/Checkbox"
import { EGAZETTE_CATEGORIES } from "../categories"

export const SubCategoryRefinementList = () => {
  const { items: refinementItems, refine } = useRefinementList({
    attribute: "subCategory",
    limit: 200,
  })
  const { items: currentRefinements } = useCurrentRefinements()

  const selectedCategoryValues = new Set(
    currentRefinements
      .find((entry) => entry.attribute === "category")
      ?.refinements.map((refinement) => String(refinement.value)) ?? [],
  )

  // Match the Jekyll behavior: hide the sub-category section entirely until a category is picked.
  if (selectedCategoryValues.size === 0) return null

  const availableSubCategories = EGAZETTE_CATEGORIES.flatMap((category) =>
    selectedCategoryValues.has(category.value)
      ? (category.subCategories ?? [])
      : [],
  )

  const refinementByValue = new Map(
    refinementItems.map((item) => [item.value, item]),
  )

  const rows = availableSubCategories.map(({ value, displayLabel }) => {
    const match = refinementByValue.get(value)
    return {
      value,
      label: displayLabel,
      count: match?.count ?? 0,
      isRefined: match?.isRefined ?? false,
    }
  })

  const selectedValues = rows
    .filter((row) => row.isRefined)
    .map((row) => row.value)

  return (
    <CheckboxGroup
      aria-label="Sub-category"
      className="gap-2"
      value={selectedValues}
    >
      {rows.map((row) => {
        const isDisabled = row.count === 0 && !row.isRefined
        return (
          <Checkbox
            key={row.value}
            className="w-fit"
            value={row.value}
            isDisabled={isDisabled}
            onChange={() => refine(row.value)}
          >
            <span>
              {row.label}
              <span className="text-base-content-medium">
                {row.count === 0 ? " (No results)" : ` (${row.count})`}
              </span>
            </span>
          </Checkbox>
        )
      })}
    </CheckboxGroup>
  )
}
