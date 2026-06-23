import { ArrowRightIcon, EyeIcon, EyeSlashIcon, SpinnerIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(20, { message: "Password cannot exceed 20 characters." })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter (A-Z).",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter (a-z).",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number (0-9).",
  })
  .refine((password) => /[!@#$%^&*?]/.test(password), {
    message: "Password must contain at least one special character (!@#$%^&*?).",
  })

const validationSchema = z.object({
  email: z.email().min(1),
  password: passwordSchema,
})

export const SignInForm = () => {
  const [isShowingPassword, setIsShowingPassword] = useState(false)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      // Pass a schema or function to validate
      onSubmit: validationSchema,
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value, null, 2))
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="flex flex-col gap-y-4">
        {/* A type-safe field component*/}
        <form.Field
          name="email"
          children={(field) => {
            const isError = field.state.meta.isTouched && !field.state.meta.isValid
            const error = (field.state.meta.errors as { message: string }[])
              .map(({ message }) => message)
              .filter(Boolean)?.[0]

            return (
              <Field data-invalid={isError} className="flex flex-col gap-y-1">
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  aria-invalid={isError}
                  placeholder="example@gmail.com"
                  autoFocus
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isError && <FieldError>{error}</FieldError>}
              </Field>
            )
          }}
        />
        <div className="flex flex-col gap-y-1">
          <form.Field
            name="password"
            children={(field) => {
              const isError = field.state.meta.isTouched && !field.state.meta.isValid
              const error = (field.state.meta.errors as { message: string }[])
                .map(({ message }) => message)
                .filter(Boolean)?.[0]
              return (
                <Field data-invalid={isError} className="flex flex-col gap-y-1">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      aria-invalid={isError}
                      placeholder="********"
                      type={isShowingPassword ? "text" : "password"}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        className="hover:bg-transparent"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsShowingPassword((prev) => !prev)}
                      >
                        {isShowingPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {isError && <FieldError>{error}</FieldError>}
                </Field>
              )
            }}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <Button size="lg" type="submit" disabled={isSubmitting || !canSubmit}>
                Sign In
                {isSubmitting ? <SpinnerIcon className="ml-2 h-4 w-4" /> : <ArrowRightIcon className="ml-2 h-4 w-4" />}
              </Button>
            </>
          )}
        />
      </div>
    </form>
  )
}
