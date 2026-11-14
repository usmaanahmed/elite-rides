import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { getImageProblem } from '../../utils/getImageProblem'
import { createEditorExtensions } from './editorExtensions'
import { EditorStatusBar } from './EditorStatusBar'
import { EditorToolbar } from './EditorToolbar'
import { moveCursorAfterSelection } from './moveCursorAfterSelection'

type RichTextEditorProps = {
  id: string
  // The HTML. The editor only reads it once, when it is first shown.
  value: string
  onChange: (html: string) => void
  onBlur: () => void
  // Uploads an image and gives back its full link
  onUploadImage: (file: File) => Promise<string>
  placeholder?: string
  hasError?: boolean
}

// Only image files from a drop or paste (other files are ignored)
function getImageFiles(fileList: FileList | null | undefined): File[] {
  const imageFiles: File[] = []
  if (!fileList) {
    return imageFiles
  }
  for (const file of Array.from(fileList)) {
    if (file.type.startsWith('image/')) {
      imageFiles.push(file)
    }
  }
  return imageFiles
}

// A starting alt text made from the file name, e.g. "heathrow-pickup.jpg" -> "heathrow pickup"
function getAltTextFromFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, '')
  return nameWithoutExtension.replace(/[-_]+/g, ' ').trim()
}

// A Word-like editor for writing blogs: headings, fonts, colours, lists, links,
// images (upload, drag & drop, paste, resize), YouTube videos, tables and full screen mode.
// Built with TipTap. It gives back the content as HTML.
export function RichTextEditor({
  id,
  value,
  onChange,
  onBlur,
  onUploadImage,
  placeholder = 'Start writing your blog…',
  hasError = false,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [uploadError, setUploadError] = useState('')
  // Made once, so the editor is not rebuilt on every render
  const [extensions] = useState(() => createEditorExtensions(placeholder))

  const editor = useEditor({
    // Make the editor after this component is on screen (not during the first render).
    // A big page can take a while to render, and an editor made too early gets thrown away.
    immediatelyRender: false,
    extensions: extensions,
    content: value,
    editorProps: {
      attributes: {
        id: id,
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Blog content',
        'aria-invalid': String(hasError),
        class: 'blog-content min-h-105 px-5 py-5 outline-none sm:px-8 sm:py-6',
      },
      // Pasting an image (e.g. a screenshot) uploads it
      handlePaste: (_view, event) => {
        const imageFiles = getImageFiles(event.clipboardData?.files)
        if (imageFiles.length === 0) {
          return false
        }
        event.preventDefault()
        uploadAndInsertImages(imageFiles, null)
        return true
      },
      // Dropping image files from the computer uploads them where they were dropped
      handleDrop: (view, event, _slice, isMovedInsideEditor) => {
        if (isMovedInsideEditor) {
          return false
        }
        const imageFiles = getImageFiles(event.dataTransfer?.files)
        if (imageFiles.length === 0) {
          return false
        }
        event.preventDefault()
        const dropPlace = view.posAtCoords({ left: event.clientX, top: event.clientY })
        let dropPosition: number | null = null
        if (dropPlace) {
          dropPosition = dropPlace.pos
        }
        uploadAndInsertImages(imageFiles, dropPosition)
        return true
      },
    },
    onUpdate: (props) => onChange(props.editor.getHTML()),
    onBlur: () => onBlur(),
  })

  // Uploads images one by one and puts each into the text.
  // position = where to put the first image (null = at the cursor).
  async function uploadAndInsertImages(files: File[], position: number | null) {
    if (!editor) return
    setUploadError('')
    let insertPosition = position

    for (const file of files) {
      const problem = getImageProblem(file)
      if (problem !== '') {
        setUploadError(problem)
        continue
      }

      setUploadingCount((count) => count + 1)
      try {
        const imageUrl = await onUploadImage(file)
        const imageNode = { type: 'image', attrs: { src: imageUrl, alt: getAltTextFromFileName(file.name) } }

        if (insertPosition === null) {
          editor.chain().focus().insertContent(imageNode).run()
        } else {
          editor.chain().focus().insertContentAt(insertPosition, imageNode).run()
          // The next images go after this one (at the cursor)
          insertPosition = null
        }
        moveCursorAfterSelection(editor)
      } catch (error) {
        let message = 'The image could not be uploaded'
        if (error instanceof Error && error.message) {
          message = error.message
        }
        setUploadError(message)
      } finally {
        setUploadingCount((count) => count - 1)
      }
    }
  }

  // In full screen: stop the page behind from scrolling, and let Esc leave full screen
  useEffect(() => {
    if (!isFullscreen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  // The editor is made a moment after the page shows, so keep its space with a grey box until then
  if (!editor) {
    return <div className="h-130 animate-pulse rounded-xl border border-line bg-surface-muted" />
  }

  let borderClasses = 'border-line focus-within:border-accent/50 focus-within:ring-accent/10'
  if (hasError) {
    borderClasses = 'border-danger/70 focus-within:border-danger focus-within:ring-danger/10'
  }

  // Full screen covers the whole window; otherwise it is a normal box in the form
  let wrapperClasses = `relative rounded-xl border bg-surface transition-shadow focus-within:ring-4 ${borderClasses}`
  let toolbarClasses = 'sticky top-14 z-20 rounded-t-xl border-b border-line bg-surface/95 backdrop-blur lg:top-[72px]'
  let contentClasses = ''
  if (isFullscreen) {
    wrapperClasses = 'fixed inset-0 z-55 flex flex-col bg-surface'
    toolbarClasses = 'shrink-0 border-b border-line bg-surface'
    contentClasses = 'flex-1 overflow-y-auto'
  }

  return (
    <div className={wrapperClasses}>
      <div className={toolbarClasses}>
        <EditorToolbar
          editor={editor}
          onUploadImage={onUploadImage}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
      </div>

      <div className={contentClasses}>
        {/* In full screen the text sits in a comfortable reading width */}
        <div className={isFullscreen ? 'mx-auto max-w-3xl' : ''}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className={isFullscreen ? 'shrink-0' : 'overflow-hidden rounded-b-xl'}>
        <EditorStatusBar editor={editor} uploadingCount={uploadingCount} uploadError={uploadError} />
      </div>
    </div>
  )
}
