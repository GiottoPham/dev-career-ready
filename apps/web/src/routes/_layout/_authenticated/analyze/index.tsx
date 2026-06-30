import { ArrowRightIcon, CaretRightIcon, FilePdfIcon, UploadIcon, XIcon } from "@phosphor-icons/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState, useTransition } from "react"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useAnalyzeMutation } from "@/api/mutations/analyze"
import { Button } from "@/components/ui/button"
import { ComboboxMultiple } from "@/components/ui/combobox-multiple"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api"
import { skillSuggestions } from "@/lib/skills"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_layout/_authenticated/analyze/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t, i18n } = useTranslation()
  const [jdInput, setJDInput] = useState("")
  const [positionInput, setPositionInput] = useState("")
  const [companyInput, setCompanyInput] = useState("")
  const [cvFile, setCVFile] = useState<File>()

  const inputCVRef = useRef<HTMLInputElement>(null)
  const [skills, setSkills] = useState<{ label: string; value: string }[]>([])

  const isFilledInCv = !!cvFile || skills.length > 0
  const isFilledInJD = !!jdInput

  const [isDropping, setIsDropping] = useState(false)

  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropRef.current) {
      return
    }
    const dropElement = dropRef.current
    const enableDropping = () => {
      setIsDropping(true)
    }
    const disableDropping = () => setIsDropping(false)

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      const items = [...(e.dataTransfer?.items ?? [])]
        .map((item) => item.getAsFile())
        .filter((item): item is File => !!item)

      if (items.length > 0) {
        setCVFile(items[0])
        setIsDropping(false)
      }
    }
    const disableWindowDrop = (e: DragEvent) => {
      e.preventDefault()
    }

    dropElement.addEventListener("dragover", enableDropping)
    dropElement.addEventListener("dragleave", disableDropping)
    dropElement.addEventListener("drop", handleDrop)
    window.addEventListener("drop", disableWindowDrop)
    window.addEventListener("dragover", disableWindowDrop)

    return () => {
      dropElement.removeEventListener("dragover", enableDropping)
      dropElement.removeEventListener("dragleave", disableDropping)
      dropElement.removeEventListener("drop", handleDrop)
      window.removeEventListener("drop", disableWindowDrop)
      window.removeEventListener("dragover", disableWindowDrop)
    }
  }, [])

  const { mutateAsync } = useAnalyzeMutation()
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate({ from: "/analyze/" })
  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("jobDescription", jdInput)
        formData.append("language", i18n.language)
        if (positionInput) formData.append("position", positionInput)
        if (companyInput) formData.append("company", companyInput)
        if (skills.length > 0) formData.append("skills", JSON.stringify(skills))
        if (cvFile) formData.append("cvFile", cvFile)
        const { resultId } = await mutateAsync(formData)
        toast.success("Documents submitted")
        navigate({ to: "/analyze/results/$resultId", params: { resultId: String(resultId) } })
      } catch (e) {
        if (e instanceof ApiError) toast.error(e.message)
        else toast.error("Something went wrong. Please try again later.")
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
          <div className="border-border border">
            <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("analyzer.jobMeta.label")}</span>
            </div>
            <div className="flex flex-col">
              <div className="border-border flex flex-col gap-y-2 border-b p-4">
                <Label htmlFor="positionInput">
                  {t("analyzer.jobMeta.positionLabel")}{" "}
                  <span className="text-muted-foreground">({t("analyzer.jobMeta.optional")})</span>
                </Label>
                <Input
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
              <div className="flex flex-col gap-y-2 p-4">
                <Label htmlFor="jdInput">{t("analyzer.jdInput.label")}</Label>
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
              </div>
            </div>
          </div>
          <div className="border-border mt-10 border">
            <div className="border-border text-muted-foreground md:text-md flex flex-row items-center gap-x-2 border-b p-4 text-xs tracking-widest uppercase">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("analyzer.cvInput.label")}</span>
            </div>
            <Tabs defaultValue="upload">
              <div className="border-border border-b px-2">
                <TabsList variant="line">
                  <TabsTrigger value="upload">{t("analyzer.cvInput.tabs.uploadCV")}</TabsTrigger>
                  <TabsTrigger value="manual">{t("analyzer.cvInput.tabs.manually")}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="upload" className="p-4">
                <div
                  ref={dropRef}
                  onClick={() => {
                    inputCVRef.current?.click()
                  }}
                  className={cn(
                    "flex h-50 cursor-pointer flex-col items-center justify-center gap-y-2 border border-b border-dashed",
                    { "border-primary": isDropping, hidden: !!cvFile }
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
                      if (e.target.files?.length) setCVFile(e.target.files?.[0])
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
          </div>
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
            {t("analyzer.hero.heading")}
            {isPending ? <Spinner className="h-8 w-8" /> : <ArrowRightIcon className="h-8 w-8" />}
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
