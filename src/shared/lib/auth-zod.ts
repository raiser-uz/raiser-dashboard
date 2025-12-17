import z from "zod"

export const authZod = {
  email: z.email().min(1, "Почта не может быть пустой"),
  password: z
    .string()
    .min(1, "Пароль не может быть пустым")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/, {
      message: "Пароль должен содержать минимум 3 символа, буквы и цифры",
    }),
}
