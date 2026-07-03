import type { Language } from "@packages/shared"
import { format, formatDistanceToNow, type Locale } from "date-fns"
import { enUS, vi } from "date-fns/locale"

const localeMap: Record<Language, Locale> = {
  en: enUS,
  vi,
}

const DATE_FORMATS = {
  "dd MMM, yyyy": "dd MMM, yyyy",
  "dd MMM, yyyy · HH:mm": "dd MMM, yyyy · HH:mm",
  "MMM yyyy": "MMM yyyy",
  "HH:mm": "HH:mm",
  "dd/MM/yyyy": "dd/MM/yyyy",
} as const

export type DateFormat = keyof typeof DATE_FORMATS

export const formatDate = (date: Date, fmt: DateFormat, language: Language): string =>
  format(date, DATE_FORMATS[fmt], { locale: localeMap[language] })

export const formatRelative = (date: Date, language: Language): string =>
  formatDistanceToNow(date, { addSuffix: true, locale: localeMap[language] })
