"use client"

import { NumberField as PrimitiveNumberField } from "@base-ui/react"
import { MinusIcon, PlusIcon } from "@phosphor-icons/react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

function NumberField({
  showSteppers,
  ...props
}: PrimitiveNumberField.Root.Props & {
  showSteppers?: boolean
}) {
  return (
    <PrimitiveNumberField.Root {...props}>
      <PrimitiveNumberField.Group render={<InputGroup className="has-disabled:opacity-100 has-disabled:bg-transparent dark:has-disabled:bg-transparent" />}>
        {showSteppers && (
          <InputGroupAddon>
            <PrimitiveNumberField.Decrement render={<InputGroupButton size="icon-xs" />}>
              <MinusIcon />
            </PrimitiveNumberField.Decrement>
          </InputGroupAddon>
        )}
        <PrimitiveNumberField.Input render={<InputGroupInput className="text-center" />} />
        {showSteppers && (
          <InputGroupAddon align="inline-end">
            <PrimitiveNumberField.Increment render={<InputGroupButton size="icon-xs" />}>
              <PlusIcon />
            </PrimitiveNumberField.Increment>
          </InputGroupAddon>
        )}
      </PrimitiveNumberField.Group>
    </PrimitiveNumberField.Root>
  )
}

export { NumberField }
