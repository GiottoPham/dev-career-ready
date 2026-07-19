import { ArrowRightIcon, FileDocIcon, FilePdfIcon, UploadIcon, XIcon } from "@phosphor-icons/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useRef, useState, useTransition } from "react"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useAnalyzeMutation } from "@/api/mutations/analyze"
import { Button } from "@/components/ui/button"
import { ComboboxMultiple } from "@/components/ui/combobox-multiple"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionPanel } from "@/components/ui/section-panel"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useFileDropzone } from "@/hooks/use-file-dropzone"
import { ApiError } from "@/lib/api"
import { skillSuggestions } from "@/lib/skills"
import { cn } from "@/lib/utils"

const JD_ACCEPT = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export const Route = createFileRoute("/_layout/_authenticated/analyze/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t, i18n } = useTranslation()
  const [jdInput, setJDInput] = useState("")
  const [jdFile, setJDFile] = useState<File>()
  const [positionInput, setPositionInput] = useState("")
  const [companyInput, setCompanyInput] = useState("")
  const [cvFile, setCVFile] = useState<File>()

  const inputCVRef = useRef<HTMLInputElement>(null)
  const inputJDRef = useRef<HTMLInputElement>(null)
  const [skills, setSkills] = useState<{ label: string; value: string }[]>([])

  const isFilledInCv = !!cvFile || skills.length > 0
  const isFilledInJD = !!jdInput || !!jdFile

  const { ref: cvDropRef, isDropping: isCvDropping } = useFileDropzone(setCVFile)
  const { ref: jdDropRef, isDropping: isJdDropping } = useFileDropzone(setJDFile)

  const { mutateAsync } = useAnalyzeMutation()
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate({ from: "/analyze/" })
  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        if (jdFile) {formData.append("jdFile", jdFile)}
        else {formData.append("jobDescription", jdInput)}
        formData.append("language", i18n.language)
        if (positionInput) {formData.append("position", positionInput)}
        if (companyInput) {formData.append("company", companyInput)}
        if (skills.length > 0) {formData.append("skills", JSON.stringify(skills))}
        if (cvFile) {formData.append("cvFile", cvFile)}
        const { resultId } = await mutateAsync(formData)
        toast.success("Documents submitted")
        navigate({ to: "/analyze/results/$resultId", params: { resultId: String(resultId) } })
      } catch (e) {
        if (e instanceof ApiError) {toast.error(e.message)}
        else {toast.error("Something went wrong. Please try again later.")}
      }
    })
  }

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
          <SectionPanel title={t("analyzer.jobMeta.label")} variant="xs" bodyClassName="flex flex-col p-0">
            <div className="flex flex-col">
              <div className="border-border flex flex-col gap-y-2 border-b p-4">
                <Label htmlFor="positionInput">
                  {t("analyzer.jobMeta.positionLabel")}{" "}
                  <span className="text-muted-foreground">({t("analyzer.jobMeta.optional")})</span>
                </Label>
                <Input
                  autoFocus
                  id="positionInput"
                  placeholder={t("analyzer.jobMeta.positionPlaceholder")}
                  value={positionInput}
                  onChange={(e) => setPositionInput(e.target.value)}
                  className="border-transparent pl-0 focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
              <div className="border-border flex flex-col gap-y-2 border-b p-4">
                <Label htmlFor="companyNameInput">
                  {t("analyzer.jobMeta.companyLabel")}{" "}
                  <span className="text-muted-foreground">({t("analyzer.jobMeta.optional")})</span>
                </Label>
                <Input
                  id="companyNameInput"
                  placeholder={t("analyzer.jobMeta.companyPlaceholder")}
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="border-transparent pl-0 focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-col">
                <div className="border-border border-b p-4">
                  <Label>{t("analyzer.jdInput.label")}</Label>
                </div>
                <Tabs defaultValue="manual">
                  <div className="border-border border-b px-2">
                    <TabsList variant="line">
                      <TabsTrigger value="upload" onClick={() => setJDInput("")}>
                        {t("analyzer.jdInput.tabs.uploadJD")}
                      </TabsTrigger>
                      <TabsTrigger onClick={() => setJDFile(undefined)} value="manual">
                        {t("analyzer.jdInput.tabs.manually")}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="upload" className="p-4" tabIndex={-1}>
                    <div
                      ref={jdDropRef}
                      tabIndex={0}
                      role="button"
                      onClick={() => inputJDRef.current?.click()}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") {inputJDRef.current?.click()} }}
                      className={cn(
                        "flex h-50 cursor-pointer flex-col items-center justify-center gap-y-2 border border-b border-dashed p-4 focus-visible:outline-none focus-visible:border-primary",
                        { "border-primary": isJdDropping, hidden: !!jdFile }
                      )}
                    >
                      <UploadIcon className="text-primary h-8 w-8" weight="bold" />
                      <p className="text-muted-foreground text-sm md:text-base">
                        <Trans
                          i18nKey="analyzer.jdInput.uploadJD.label"
                          components={{ h: <span className="text-primary underline" /> }}
                        />
                      </p>
                      <p className="text-muted text-xs">{t("analyzer.jdInput.uploadJD.subtitle")}</p>
                      <input
                        multiple={false}
                        className="hidden"
                        type="file"
                        ref={inputJDRef}
                        accept={JD_ACCEPT}
                        onChange={(e) => {
                          if (e.target.files?.length) {setJDFile(e.target.files?.[0])}
                        }}
                      />
                    </div>
                    <div
                      className={cn("border-primary relative flex flex-row items-center gap-x-4 border p-4", {
                        hidden: !jdFile,
                      })}
                    >
                      {jdFile?.type.includes("pdf") ? (
                        <FilePdfIcon className="text-primary h-6 w-6" />
                      ) : (
                        <FileDocIcon className="text-primary h-6 w-6" />
                      )}
                      <div className="flex flex-col gap-y-2">
                        <span className="text-sm">{jdFile?.name}</span>
                        <span className="text-muted-foreground text-xs">{getFileSize(jdFile?.size ?? 0)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-lg"
                        className="absolute top-0 right-0 hover:bg-transparent"
                        onClick={() => {
                          setJDFile(undefined)
                        }}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="manual" className="p-4" tabIndex={-1}>
                    <Textarea
                      id="jdInput"
                      placeholder={
                        !positionInput || !companyInput
                          ? t("analyzer.jdInput.placeholderHint")
                          : t("analyzer.jdInput.placeholder")
                      }
                      className="h-50 border-transparent pl-0 focus-visible:border-transparent focus-visible:ring-0"
                      value={jdInput}
                      onChange={(e) => setJDInput(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </SectionPanel>
          <SectionPanel title={t("analyzer.cvInput.label")} variant="xs" className="mt-10" bodyClassName="p-0">
            <Tabs defaultValue="upload">
              <div className="border-border border-b px-2">
                <TabsList variant="line">
                  <TabsTrigger value="upload" onClick={() => setSkills([])}>
                    {t("analyzer.cvInput.tabs.uploadCV")}
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setCVFile(undefined)} value="manual">
                    {t("analyzer.cvInput.tabs.manually")}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="upload" className="p-4" tabIndex={-1}>
                <div
                  ref={cvDropRef}
                  tabIndex={0}
                  role="button"
                  onClick={() => inputCVRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") {inputCVRef.current?.click()} }}
                  className={cn(
                    "flex h-50 cursor-pointer flex-col items-center justify-center gap-y-2 border border-b border-dashed p-4 focus-visible:outline-none focus-visible:border-primary",
                    { "border-primary": isCvDropping, hidden: !!cvFile }
                  )}
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
                      if (e.target.files?.length) {setCVFile(e.target.files?.[0])}
                    }}
                  />
                </div>
                <div
                  className={cn("border-primary relative flex flex-row items-center gap-x-4 border p-4", {
                    hidden: !cvFile,
                  })}
                >
                  <FilePdfIcon className="text-primary h-6 w-6" />
                  <div className="flex flex-col gap-y-2">
                    <span className="text-sm">{cvFile?.name}</span>
                    <span className="text-muted-foreground text-xs">{getFileSize(cvFile?.size ?? 0)}</span>
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
              </TabsContent>
              <TabsContent value="manual" className="p-4">
                <ComboboxMultiple
                  placeholder="Type your skills here"
                  onValueChange={setSkills}
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
          </SectionPanel>
        </div>
      </section>
      <div className="mt-8 px-4 pb-20 md:px-6 md:pb-32">
        <div className="mx-auto flex max-w-5xl flex-row items-center justify-end">
          <Button
            onClick={handleSubmit}
            className="gap-x-4"
            size="lg"
            disabled={!isFilledInCv || !isFilledInJD || isPending}
          >
            {t("analyzer.cta.button")}
            {isPending ? <Spinner className="h-8 w-8" /> : <ArrowRightIcon className="h-8 w-8" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

const getFileSize = (bytes: number) => {
  if (bytes >= 1e6) {return `${(bytes / 1e6).toFixed(2)} MB`}
  return `${(bytes / 1e3).toFixed(2)} KB`
}
