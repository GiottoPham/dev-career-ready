"use client"

import { Fragment, useState, type ReactNode } from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

type Data<T> = {
  label: string
  value: T
  icon?: string
}
type ComboboxMultipleProps<T> = {
  options: Data<T>[]
  onValueChange: (options: Data<T>[]) => void
  values: Data<T>[]
  placeholder: string
  renderLeadingIcon?: (value: Data<T>) => ReactNode
}

export const ComboboxMultiple = <T,>({
  onValueChange,
  options,
  values,
  placeholder,
  renderLeadingIcon,
}: ComboboxMultipleProps<T>) => {
  const anchor = useComboboxAnchor()
  const [input, setInput] = useState("")
  const optionValues = options.map(({ value }) => value).map(String)
  const optionsWithAddNew = [
    ...options,
    !optionValues.includes(input) && { label: `Add new: ${input}`, value: input },
  ] as Data<T>[]

  return (
    <Combobox
      onValueChange={(values) => {
        const newValues = values.map(
          (value) => options.find((option) => option.value === value) ?? { value: value, label: value as string }
        )
        onValueChange(newValues)
        setInput("")
      }}
      value={values.map(({ value }) => value)}
      multiple
      autoHighlight
      items={optionsWithAddNew}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(values: T[]) => (
            <Fragment>
              {values
                .map((value) => options.find((option) => option.value === value) ?? { label: value as string, value })
                .map(({ value, label }) => (
                  <ComboboxChip key={`${value}`}>{label}</ComboboxChip>
                ))}
              <ComboboxChipsInput placeholder={placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Data<T>) => {
            return (
              <ComboboxItem key={`${item.value}`} value={item.value}>
                {renderLeadingIcon?.(item)}
                {item.label}
              </ComboboxItem>
            )
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
