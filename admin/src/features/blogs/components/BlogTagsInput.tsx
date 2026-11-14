import { X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { MAX_TAGS, TAG_MAX_LENGTH } from '../schemas/blogFormSchema'

type BlogTagsInputProps = {
  id: string
  value: string[]
  onChange: (tags: string[]) => void
  onBlur: () => void
  hasError?: boolean
}

// A box where tags are typed one by one. Enter or comma turns the text into a tag "chip".
export function BlogTagsInput({ id, value, onChange, onBlur, hasError = false }: BlogTagsInputProps) {
  const [text, setText] = useState('')

  const canAddMore = value.length < MAX_TAGS

  // Adds the typed text as a tag, unless it is empty or already in the list
  function addTypedTag() {
    const newTag = text.trim().replace(/,/g, '')
    setText('')
    if (newTag === '' || !canAddMore) {
      return
    }

    const alreadyAdded = value.some((tag) => tag.toLowerCase() === newTag.toLowerCase())
    if (!alreadyAdded) {
      onChange([...value, newTag])
    }
  }

  function removeTag(tagToRemove: string) {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      // Enter would otherwise submit the whole blog form
      event.preventDefault()
      addTypedTag()
      return
    }
    // Backspace in an empty box removes the last tag
    if (event.key === 'Backspace' && text === '' && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const stateClasses = hasError
    ? 'border-danger/70 focus-within:border-danger focus-within:ring-danger/10'
    : 'border-line focus-within:border-accent/50 focus-within:ring-accent/10'

  return (
    <div>
      <div className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-surface px-2.5 py-2 transition-all focus-within:ring-4 ${stateClasses}`}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-accent-soft py-0.5 pl-2 pr-1 text-xs font-medium text-accent-ink">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className="grid size-4 place-items-center rounded hover:bg-accent/15"
            >
              <X className="size-3" strokeWidth={2.5} />
            </button>
          </span>
        ))}

        {canAddMore && (
          <input
            id={id}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              addTypedTag()
              onBlur()
            }}
            placeholder={value.length === 0 ? 'e.g. airport, heathrow, travel tips' : 'Add tag'}
            maxLength={TAG_MAX_LENGTH}
            autoComplete="off"
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className="h-7 min-w-24 flex-1 bg-transparent px-1 text-base text-ink outline-none placeholder:text-muted/70 sm:text-sm"
          />
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Press Enter or comma to add · {value.length} of {MAX_TAGS} used
      </p>
    </div>
  )
}
