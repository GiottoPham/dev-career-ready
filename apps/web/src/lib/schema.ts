import type { TFunction } from "i18next"
import { z } from "zod"

export const createPasswordSchema = (t: TFunction) =>
  z
    .string()
    .min(8, { message: t("validation.password.minLength") })
    .max(20, { message: t("validation.password.maxLength") })
    .refine((password) => /[A-Z]/.test(password), {
      message: t("validation.password.uppercase"),
    })
    .refine((password) => /[a-z]/.test(password), {
      message: t("validation.password.lowercase"),
    })
    .refine((password) => /[0-9]/.test(password), {
      message: t("validation.password.number"),
    })
    .refine((password) => /[!@#$%^&*?]/.test(password), {
      message: t("validation.password.special"),
    })
