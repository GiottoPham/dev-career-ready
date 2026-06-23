import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FOOTER_HEIGHT } from "@/lib/constant"

import { SignInForm } from "./-SignInForm"

export const Route = createFileRoute("/_layout/auth/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()

  return (
    <div style={{ height: `calc(100vh - ${FOOTER_HEIGHT}` }} className="w-full">
      <section className="w-full px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto w-full md:w-1/3">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">{t("nav.brand")}</h1>
          <h2 className="text-muted-foreground mt-4 text-center text-xs md:text-sm">
            {t("modules.skillGap.title")} · {t("modules.mockInterview.title")}
          </h2>
          <div className="border-border mt-10 w-full border">
            <Tabs defaultValue="signIn">
              <div className="border-border w-full border-b">
                <TabsList variant="line" className="h-12! w-full">
                  <TabsTrigger value="signIn">{t("auth.tabs.signIn")}</TabsTrigger>
                  <TabsTrigger value="signUp">{t("auth.tabs.signUp")}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="signIn" className="p-4">
                <SignInForm />
              </TabsContent>
              <TabsContent value="signUp" className="p-4"></TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  )
}
