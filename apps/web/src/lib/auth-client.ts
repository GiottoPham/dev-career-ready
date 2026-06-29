import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({ baseURL: window.location.origin })

export const { useSession, signIn, signOut, signUp, getSession } = authClient

export type Session = typeof authClient.$Infer.Session
