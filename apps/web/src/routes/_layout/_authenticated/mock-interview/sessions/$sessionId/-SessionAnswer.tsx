import type { InterviewSession } from "@packages/shared"
import { ArrowRightIcon, CaretRightIcon, MicrophoneIcon, SpeakerHighIcon, SpeakerXIcon, StopCircleIcon } from "@phosphor-icons/react"
import { useParams } from "@tanstack/react-router"
import { useCallback, useRef, useState, useTransition } from "react"
import { useTranslation } from "react-i18next"

import { useAnswerInterviewMutation } from "@/api/mutations/interview"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type SessionAnswerProps = {
  session: InterviewSession
  onAnswer: () => Promise<void>
}

export const SessionAnswer = ({ session, onAnswer }: SessionAnswerProps) => {
  const { t, i18n } = useTranslation()
  const { sessionId } = useParams({ from: "/_layout/_authenticated/mock-interview/sessions/$sessionId/" })
  const [answer, setAnswer] = useState("")
  const [isTransitioning, startTransition] = useTransition()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const recordRef = useRef<InstanceType<Window["SpeechRecognition"]>>(null)
  const { mutateAsync: answerInterview } = useAnswerInterviewMutation({ sessionId: Number(sessionId) })

  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      await answerInterview({ answer })
      await onAnswer()
      setAnswer("")
    })
  }, [answer, answerInterview, onAnswer])

  const handleSpeak = (question: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(question)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleRecord = useCallback(() => {
    if (isRecording) {
      setIsRecording(false)
      recordRef.current?.stop()
      return
    }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = i18n.language === "en" ? "en-US" : "vi-VN"
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }
    recognition.onend = () => setIsRecording(false)
    recordRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [i18n.language, isRecording])

  const { turns, config } = session
  const currentQuestion = turns[turns.length - 1]!
  const previousTurns = turns.slice(0, -1)
  const questionNumbers = config.questionCount
  const currentProgress = ((currentQuestion.turnIndex + 1) / questionNumbers) * 100
  const hasTTS = typeof window !== "undefined" && "speechSynthesis" in window
  const hasSpeechRecognition =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  return (
    <section>
      <div className="border-border border">
        <div className="border-border flex items-center justify-between border-b p-4">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">
            {t("mockInterview.session.questionProgress", { current: currentQuestion.turnIndex + 1, total: questionNumbers })}
          </span>
        </div>
        <Progress value={currentProgress} />

        <div className="border-border border-b p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-muted-foreground text-xs uppercase tracking-widest">{t("mockInterview.session.interviewer")}</span>
            {hasTTS && (
              <button
                type="button"
                onClick={() => handleSpeak(currentQuestion.question)}
                className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs transition-colors"
              >
                {isSpeaking ? <SpeakerXIcon className="h-3.5 w-3.5" /> : <SpeakerHighIcon className="h-3.5 w-3.5" />}
                {isSpeaking ? t("mockInterview.session.stop") : t("mockInterview.session.readAloud")}
              </button>
            )}
          </div>
          <p className="text-sm leading-relaxed md:text-base">{currentQuestion.question}</p>
        </div>

        <div className="border-border border-b p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-muted-foreground text-xs uppercase tracking-widest">{t("mockInterview.session.yourAnswer")}</span>
            {hasSpeechRecognition && (
              <button
                type="button"
                onClick={handleRecord}
                disabled={isTransitioning}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  isRecording
                    ? "text-red-500 hover:text-red-400"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {isRecording ? (
                  <StopCircleIcon className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <MicrophoneIcon className="h-3.5 w-3.5" />
                )}
                {isRecording ? t("mockInterview.session.stopRecording") : t("mockInterview.session.recordAnswer")}
              </button>
            )}
          </div>
          <Textarea
            id="yourAnswerInput"
            placeholder={t("mockInterview.session.answerPlaceholder")}
            className="h-50 border-transparent pl-0 focus-visible:border-transparent focus-visible:ring-0"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isTransitioning}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSubmit}
          className="gap-x-4"
          size="lg"
          disabled={!answer.trim() || isTransitioning}
        >
          {t("mockInterview.session.nextQuestion")}
          {isTransitioning ? <Spinner className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
        </Button>
      </div>

      {previousTurns.length > 0 && (
        <div className="border-border mt-12 border">
          <div className="border-border border-b p-4">
            <span className="text-muted-foreground flex flex-row items-center gap-x-2 text-sm">
              <CaretRightIcon className="text-primary h-4 w-4" weight="bold" />
              <span className="font-bold">{t("mockInterview.session.previousQuestions")}</span>
            </span>
          </div>
          <div className="flex flex-col gap-y-2 p-4">
            {previousTurns.map(({ question, turnIndex, userAnswer }, idx) => (
              <div
                key={turnIndex}
                className={cn("border-border border-b pb-4", {
                  "border-none pb-0": idx === previousTurns.length - 1,
                })}
              >
                <p className="text-primary mb-1 text-xs font-bold">{t("mockInterview.session.questionLabel", { n: turnIndex + 1 })}</p>
                <p className="mb-2 text-xs leading-relaxed font-medium">{question}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{userAnswer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
