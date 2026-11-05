import { useEffect, useState } from 'react'

type LoadedPreview = {
  file: File
  dataUrl: string
}

// Reads an image File (e.g. one the user just picked) and returns a URL an <img> can show.
// Returns null while there is no file, or while a new file is still being read.
export function useImagePreview(file: File | null) {
  const [loadedPreview, setLoadedPreview] = useState<LoadedPreview | null>(null)

  useEffect(() => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLoadedPreview({ file, dataUrl: reader.result })
      }
    }
    reader.readAsDataURL(file)

    // Stop reading if the file changes before it has finished
    return () => reader.abort()
  }, [file])

  // The saved preview may still belong to the previous file, so only use it if it matches
  if (loadedPreview && loadedPreview.file === file) {
    return loadedPreview.dataUrl
  }
  return null
}
