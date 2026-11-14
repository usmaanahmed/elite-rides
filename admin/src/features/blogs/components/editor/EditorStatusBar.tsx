import { useEditorState, type Editor } from '@tiptap/react'
import { CircleAlert, LoaderCircle } from 'lucide-react'

type EditorStatusBarProps = {
  editor: Editor
  // How many images are uploading right now
  uploadingCount: number
  // Last upload problem ('' = none)
  uploadError: string
}

// A reader gets through about this many words a minute (same as the server)
const WORDS_PER_MINUTE = 200

// The thin bar under the editor: word count, reading time and image upload status
export function EditorStatusBar({ editor, uploadingCount, uploadError }: EditorStatusBarProps) {
  const counts = useEditorState({
    editor: editor,
    selector: (context) => {
      const counter = context.editor.storage.characterCount
      // A closed editor has no counter any more
      if (!counter) {
        return { words: 0, characters: 0 }
      }
      return { words: counter.words(), characters: counter.characters() }
    },
  })

  let readingMinutes = Math.round(counts.words / WORDS_PER_MINUTE)
  if (readingMinutes < 1) {
    readingMinutes = 1
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line bg-surface-muted px-4 py-2 text-xs text-muted">
      <div className="flex min-w-0 items-center gap-3">
        {uploadingCount > 0 && (
          <span className="flex items-center gap-1.5 font-medium text-accent-ink">
            <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} />
            Uploading {uploadingCount} {uploadingCount === 1 ? 'image' : 'images'}…
          </span>
        )}
        {uploadError !== '' && (
          <span role="alert" className="flex min-w-0 items-center gap-1.5 font-medium text-danger">
            <CircleAlert className="size-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{uploadError}</span>
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 tabular-nums">
        <span>{counts.words} words</span>
        <span>{counts.characters} characters</span>
        <span>{readingMinutes} min read</span>
      </div>
    </div>
  )
}
