import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({ baseURL: import.meta.env.VITE_API_URL })

export const { useSession, signIn, signOut, signUp, getSession } = authClient

export type Session = typeof authClient.$Infer.Session
