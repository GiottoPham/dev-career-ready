import { ArrowRightIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form"
import { redirect, useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useState, useTransition } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { GoogleIcon } from "@/components/icons/flat-color-icons-google"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { signIn, signUp } from "@/lib/auth-client"
import { createPasswordSchema } from "@/lib/schema"
import { getSafeRedirectPath } from "@/lib/utils"

type SignUpFormProps = {
  onSignIn: () => void
}

export const SignUpForm = ({ onSignIn }: SignUpFormProps) => {
  const { t } = useTranslation()
  const { redirect: rawRedirect } = useSearch({ from: "/_layout/auth/" })
  const safePath = getSafeRedirectPath(rawRedirect)
  const [isShowingPassword, setIsShowingPassword] = useState(false)
  const [totalError, setTotalError] = useState("")
  const navigate = useNavigate({ from: "/auth/" })

  const validationSchema = z
    .object({
      name: z.string().min(1, { message: t("validation.nameRequired") }),
      email: z.email().min(1),
      password: createPasswordSchema(t),
      confirmPassword: z.string().min(1, { message: t("validation.confirmRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword"),
      path: ["confirmPassword"],
    })

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: validationSchema,
    },
    onSubmit: async ({ value: { email, password, name } }) => {
      const { error } = await signUp.email({ email, password, name })
      if (error?.message) {
        setTotalError(error.message)
      } else {
        navigate({ to: safePath })
      }
    },
  })

  const [isPending, startTransition] = useTransition()

  const handleSignUpWithGoogle = useCallback(() => {
    startTransition(async () => {
      const callbackURL = new URL(safePath, window.location.origin).toString()
      const { error } = await signIn.social({ provider: "google", callbackURL })
      if (error?.message) {
        setTotalError(error.message)
      } else {
        redirect({ to: safePath })
      }
    })
  }, [safePath])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-y-4 px-4 pt-4">
          <form.Field
            name="name"
            children={(field) => {
              const isError = field.state.meta.isTouched && !field.state.meta.isValid
              const error = (field.state.meta.errors as { message: string }[])
                .map(({ message }) => message)
                .filter(Boolean)?.[0]

              return (
                <Field data-invalid={isError} className="flex flex-col gap-y-1">
                  <FieldLabel htmlFor={field.name}>{t("auth.fields.name")}</FieldLabel>
                  <Input
                    aria-invalid={isError}
                    placeholder={t("auth.fields.namePlaceholder")}
                    autoFocus
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      if (totalError) {setTotalError("")}
                      field.handleChange(e.target.value)
                    }}
                  />
                  {isError && <FieldError>{error}</FieldError>}
                </Field>
              )
            }}
          />
          <form.Field
            name="email"
            children={(field) => {
              const isError = field.state.meta.isTouched && !field.state.meta.isValid
              const error = (field.state.meta.errors as { message: string }[])
                .map(({ message }) => message)
                .filter(Boolean)?.[0]

              return (
                <Field data-invalid={isError} className="flex flex-col gap-y-1">
                  <FieldLabel htmlFor={field.name}>{t("auth.fields.email")}</FieldLabel>
                  <Input
                    aria-invalid={isError}
                    placeholder={t("auth.fields.emailPlaceholder")}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      if (totalError) {setTotalError("")}
                      field.handleChange(e.target.value)
                    }}
                  />
                  {isError && <FieldError>{error}</FieldError>}
                </Field>
              )
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              const isError = field.state.meta.isTouched && !field.state.meta.isValid
              const error = (field.state.meta.errors as { message: string }[])
                .map(({ message }) => message)
                .filter(Boolean)?.[0]
              return (
                <Field data-invalid={isError} className="flex flex-col gap-y-1">
                  <FieldLabel htmlFor={field.name}>{t("auth.fields.password")}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      aria-invalid={isError}
                      placeholder={t("auth.fields.passwordPlaceholder")}
                      type={isShowingPassword ? "text" : "password"}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        if (totalError) {setTotalError("")}
                        field.handleChange(e.target.value)
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        className="hover:bg-transparent"
                        variant="ghost"
                        size="icon"
                        type="button"
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
          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isError = field.state.meta.isTouched && !field.state.meta.isValid
              const error = (field.state.meta.errors as { message: string }[])
                .map(({ message }) => message)
                .filter(Boolean)?.[0]
              return (
                <Field data-invalid={isError} className="flex flex-col gap-y-1">
                  <FieldLabel htmlFor={field.name}>{t("auth.fields.confirmPassword")}</FieldLabel>
                  <Input
                    aria-invalid={isError}
                    placeholder={t("auth.fields.passwordPlaceholder")}
                    type={isShowingPassword ? "text" : "password"}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      if (totalError) {setTotalError("")}
                      field.handleChange(e.target.value)
                    }}
                  />
                  {isError && <FieldError>{error}</FieldError>}
                </Field>
              )
            }}
          />
          {totalError && (
            <span>
              <FieldError>{totalError}</FieldError>
            </span>
          )}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button size="lg" type="submit" disabled={isSubmitting || !canSubmit}>
                {t("auth.signUp.submit")}
                {isSubmitting ? <Spinner className="ml-2 h-4 w-4" /> : <ArrowRightIcon className="ml-2 h-4 w-4" />}
              </Button>
            )}
          />
        </div>
      </form>
      <div className="m-4 flex flex-row items-center gap-x-2">
        <div className="bg-border h-px w-full" />
        <span>{t("auth.signUp.or")}</span>
        <div className="bg-border h-px w-full" />
      </div>
      <div className="w-full px-4 pb-4">
        <Button onClick={handleSignUpWithGoogle} disabled={isPending} variant="outline" size="lg" className="w-full">
          <GoogleIcon className="mr-2 h-4 w-4" />
          {t("auth.signUp.google")}
        </Button>
      </div>
      <div className="border-border border-t p-4">
        <div className="flex flex-row items-center justify-center">
          <span className="text-muted-foreground text-xs">{t("auth.signUp.hasAccount")}</span>
          <Button onClick={onSignIn} variant="ghost" className="text-primary underline hover:bg-transparent">
            {t("auth.signUp.signIn")}
          </Button>
        </div>
      </div>
    </div>
  )
}
