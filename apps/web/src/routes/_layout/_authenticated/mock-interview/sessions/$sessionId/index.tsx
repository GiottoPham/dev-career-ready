import { ArrowRightIcon, MicrophoneIcon, SpeakerHighIcon, SpeakerXIcon } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useCallback, useRef, useState, useTransition } from "react"
import { useTranslation } from "react-i18next"

import { useInterviewSession } from "@/api/queries/interview-sessions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/_layout/_authenticated/mock-interview/sessions/$sessionId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { i18n } = useTranslation()
  const { sessionId } = Route.useParams()
  const { data: session, isPending, refetch: refetchSession } = useInterviewSession({ sessionId: Number(sessionId) })
  const [answer, setAnswer] = useState("")

  const [isTransitioning, startTransition] = useTransition()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const recordRef = useRef<InstanceType<Window["SpeechRecognition"]>>(null)

  const handleSubmit = () => {
    startTransition(async () => {
      await refetchSession()
    })
  }

  const handleSpeak = (activeQuestion: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(activeQuestion)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleRecord = useCallback(() => {
    if (isRecording) {
      setIsRecording(false)
      recordRef.current.stop()
      return
    }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    const speechRecognition = new SR()
    speechRecognition.lang = i18n.language === "en" ? "en-US" : "vi-VN"
    speechRecognition.continuous = true
    speechRecognition.interimResults = false
    recordRef.current = speechRecognition
    speechRecognition.start()
    setIsRecording(true)
    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setAnswer(transcript)
    }
  }, [i18n.language, isRecording])

  if (isPending || !session) {
    return null
  }

  const { position, company, turns, config, status } = session

  const currentQuestion = turns[turns.length - 1]
  const questionNumbers = config.questionCount
  const currentProgress = ((currentQuestion.turnIndex + 1) / questionNumbers) * 100
  const previousTurns = turns.slice(0, -1)
  const hasTTS = typeof window !== "undefined" && "speechSynthesis" in window

  const hasSpeechRecognition =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  if (status === "active") {
    return (
      <div className="h-full">
        <section className="px-4 pt-20 pb-5 md:px-6 md:pt-32 md:pb-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-muted-foreground mb-4 text-base font-bold tracking-widest uppercase md:text-lg">
              Mock interview for
            </h1>
            <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl lg:text-4xl">
              {position} @ {company}
            </h2>
            <p className="text-muted-foreground mt-4 text-xs whitespace-pre-line md:text-sm">
              Mode: <span className="text-primary uppercase">{config.mode}</span> · Difficulty:{" "}
              <span className="text-primary uppercase">{config.difficulty}</span> · Focus area:{" "}
              <span className="text-primary uppercase">{config.focusArea}</span>
            </p>
          </div>
        </section>
        <section className="px-4 pb-20 md:px-6 md:pb-32">
          <div className="mx-auto max-w-5xl">
            <div className="border-border border">
              <div className="p-4">
                <span className="text-xs">
                  Question {currentQuestion.turnIndex + 1} / {questionNumbers}
                </span>
              </div>
              <Progress value={currentProgress} />
              <div className="border-border flex flex-col gap-y-4 border-b p-4">
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-bold uppercase">Interviewer</span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!hasTTS}
                    onClick={() => handleSpeak(currentQuestion.question)}
                  >
                    {isSpeaking ? <SpeakerXIcon className="h-4 w-4" /> : <SpeakerHighIcon className="h-4 w-4" />}
                  </Button>
                </div>
                <span className="text-muted-foreground text-sm leading-loose whitespace-pre-line">
                  {currentQuestion.question}
                </span>
              </div>
              <div className="border-border flex flex-col gap-y-2 border-b p-4">
                <div className="flex flex-row items-center justify-between">
                  <Label htmlFor="yourAnswerInput" className="text-sm">
                    Your answer
                  </Label>
                  {hasSpeechRecognition && (
                    <Button onClick={handleRecord} variant="outline">
                      {!isRecording ? (
                        <MicrophoneIcon className="h-4 w-4" />
                      ) : (
                        <div className="h-3 w-3 animate-pulse bg-red-400" />
                      )}
                      {isRecording ? "Recording" : "Record your answer"}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="yourAnswerInput"
                  placeholder="Type your answer here ...."
                  className="h-50 border-transparent pl-0 focus-visible:border-transparent focus-visible:ring-0 md:text-sm!"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} className="gap-x-4" size="lg" disabled={!answer}>
                Next Question
                {isTransitioning ? <Spinner className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
              </Button>
            </div>
            {previousTurns.length > 0 && (
              <div className="border-border border">
                <div className="border-border border-b p-4">
                  <span> Previous Questions </span>
                </div>
                {previousTurns.map(({ question, turnIndex, userAnswer }) => (
                  <div className="border-border flex flex-col border-b p-4">
                    <span>Q {turnIndex + 1}</span>
                    <span>{question}</span>
                    <span>{userAnswer}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }
}
