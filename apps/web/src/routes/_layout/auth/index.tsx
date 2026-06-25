import { createFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FOOTER_HEIGHT } from "@/lib/constant"
import { getSafeRedirectPath } from "@/lib/utils"

import { SignInForm } from "./-SignInForm"
import { SignUpForm } from "./-SignUpForm"

export const Route = createFileRoute("/_layout/auth/")({
  beforeLoad: ({ context, search }) => {
    if (context.session) {
      const { redirect: rawRedirect } = search
      const safePath = getSafeRedirectPath(rawRedirect)
      throw redirect({ to: safePath })
    }
  },
  component: RouteComponent,
  validateSearch: z.object({ redirect: z.string().optional() }),
})

function RouteComponent() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<"signIn" | "signUp">("signIn")

  return (
    <div style={{ height: `calc(100vh - ${FOOTER_HEIGHT}` }} className="w-full">
      <section className="w-full px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto w-full md:w-1/2 lg:w-1/3">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">{t("nav.brand")}</h1>
          <h2 className="text-muted-foreground mt-4 text-center text-xs md:text-sm">
            {t("modules.skillGap.title")} · {t("modules.mockInterview.title")}
          </h2>
          <div className="border-border mt-10 w-full border">
            <Tabs value={tab} onValueChange={setTab}>
              <div className="border-border w-full border-b">
                <TabsList variant="line" className="h-12! w-full">
                  <TabsTrigger value="signIn">{t("auth.tabs.signIn")}</TabsTrigger>
                  <TabsTrigger value="signUp">{t("auth.tabs.signUp")}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="signIn">
                <SignInForm onSignUp={() => setTab("signUp")} />
              </TabsContent>
              <TabsContent value="signUp">
                <SignUpForm onSignIn={() => setTab("signIn")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  )
}
