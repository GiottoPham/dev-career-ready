import { useEffect, useRef, useState } from "react"

export function useFileDropzone(onDrop: (file: File) => void) {
  const [isDropping, setIsDropping] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const dropElement = ref.current
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
        onDrop(items[0])
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
  }, [onDrop])

  return { ref, isDropping }
}
