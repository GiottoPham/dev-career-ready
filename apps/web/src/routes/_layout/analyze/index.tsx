import { ArrowRightIcon, FilePdfIcon, UploadIcon, XIcon } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useRef, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { ComboboxMultiple } from "@/components/ui/combobox-multiple"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { skillSuggestions } from "@/lib/skills"

export const Route = createFileRoute("/_layout/analyze/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const [jdInput, setJDInput] = useState("")
  const [cvFile, setCVFile] = useState<File>()

  const inputCVRef = useRef<HTMLInputElement>(null)
  const [skills, setSkills] = useState<{ label: string; value: string }[]>([])

  const isFilledInCv = !!cvFile || skills.length > 0
  const isFilledInJD = !!jdInput

  return (
    <div className="h-full">
      <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
            {t("analyzer.hero.heading")}
          </h1>
          <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
            <Trans i18nKey="hero.line1" components={{ h: <span className="text-primary" /> }} />
          </h2>
          <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
            {t("analyzer.hero.description1")}
          </p>
          <p className="text-muted-foreground mt-1 text-xs whitespace-pre-line md:text-sm">
            {t("analyzer.hero.description2")}
          </p>
        </div>
      </section>
      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="border-border border">
            <div className="border-border text-muted-foreground md:text-md border-b p-4 text-xs tracking-widest uppercase">
              {t("analyzer.jdInput.label")}
            </div>
            <div className="p-4">
              <Textarea
                placeholder={t("analyzer.jdInput.placeholder")}
                className="h-50 border-transparent focus-visible:border-transparent focus-visible:ring-0"
                value={jdInput}
                onChange={(e) => setJDInput(e.target.value)}
              />
            </div>
          </div>
          <div className="border-border mt-10 border">
            <div className="border-border text-muted-foreground md:text-md border-b p-4 text-xs tracking-widest uppercase">
              {t("analyzer.cvInput.label")}
            </div>
            <Tabs defaultValue="upload">
              <div className="border-border border-b px-2">
                <TabsList variant="line">
                  <TabsTrigger value="upload">{t("analyzer.cvInput.tabs.uploadCV")}</TabsTrigger>
                  <TabsTrigger value="manual">{t("analyzer.cvInput.tabs.manually")}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="upload" className="p-4">
                {!cvFile && (
                  <>
                    <div
                      onClick={() => {
                        inputCVRef.current?.click()
                      }}
                      className="flex h-50 cursor-pointer flex-col items-center justify-center gap-y-2 border border-b border-dashed"
                    >
                      <UploadIcon className="text-primary h-8 w-8" weight="bold" />
                      <p className="text-muted-foreground text-sm md:text-base">
                        <Trans
                          i18nKey="analyzer.cvInput.uploadCV.label"
                          components={{ h: <span className="text-primary underline" /> }}
                        />
                      </p>
                      <p className="text-muted text-xs">{t("analyzer.cvInput.uploadCV.subtitle")}</p>
                      <input
                        multiple={false}
                        className="hidden"
                        type="file"
                        ref={inputCVRef}
                        accept="application/pdf"
                        onChange={(e) => {
                          if (e.target.files?.length) setCVFile(e.target.files?.[0])
                        }}
                      />
                    </div>
                  </>
                )}
                {cvFile && (
                  <div className="border-primary relative flex flex-row items-center gap-x-4 border p-4">
                    <FilePdfIcon className="text-primary h-6 w-6" />
                    <div className="flex flex-col gap-y-2">
                      <span className="text-sm">{cvFile.name}</span>
                      <span className="text-muted-foreground text-xs">{getFileSize(cvFile.size)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      className="absolute top-0 right-0 hover:bg-transparent"
                      onClick={() => {
                        setCVFile(undefined)
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="manual" className="p-4">
                <ComboboxMultiple
                  placeholder="Type your skills here"
                  onValueChange={(skills) => {
                    setSkills(skills)
                  }}
                  values={skills}
                  options={skillSuggestions}
                  renderLeadingIcon={({ value }) => (
                    <img
                      height={16}
                      width={16}
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${value}/${value}-original.svg`}
                    />
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <div className="mt-8 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <Button className="gap-x-4" size="lg" disabled={!isFilledInCv || !isFilledInJD}>
            {t("analyzer.hero.heading")}
            <ArrowRightIcon className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const getFileSize = (bytes: number) => {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`
  return `${(bytes / 1e3).toFixed(2)} KB`
}
