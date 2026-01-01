export const formatDateTime = (
  value?: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US",
) => {
  if (!value) return ""

  const data = new Date(value)

  const opts: Intl.DateTimeFormatOptions = options || {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }

  return new Intl.DateTimeFormat(locale, opts).format(data)
}

export const currentYear = new Date().getFullYear()

export const formatDate = (
  value?: Date | string | number | null,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US",
): string => {
  if (!value) return ""

  const data = new Date(value)

  const opts: Intl.DateTimeFormatOptions = options || {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }

  return new Intl.DateTimeFormat(locale, opts).format(data)
}
