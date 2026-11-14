import type { Editor } from '@tiptap/react'

// Everything the toolbar needs to know about the text at the cursor
export type EditorToolbarState = {
  // 'paragraph', 'h1', 'h2', 'h3' or 'h4'
  blockType: string
  // e.g. '18px' ('' = normal size)
  fontSize: string
  // e.g. 'Georgia, serif' ('' = normal font)
  fontFamily: string
  // e.g. '#fc6203' ('' = normal colour)
  textColor: string
  highlightColor: string
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrike: boolean
  isCode: boolean
  isSubscript: boolean
  isSuperscript: boolean
  isLink: boolean
  // The address of the link at the cursor ('' = no link)
  linkUrl: string
  linkOpensInNewTab: boolean
  isAlignLeft: boolean
  isAlignCenter: boolean
  isAlignRight: boolean
  isAlignJustify: boolean
  isBulletList: boolean
  isOrderedList: boolean
  isTaskList: boolean
  isBlockquote: boolean
  isCodeBlock: boolean
  isInTable: boolean
  canUndo: boolean
  canRedo: boolean
  canIndent: boolean
  canOutdent: boolean
}

// Which heading (or paragraph) the cursor is in
function getBlockType(editor: Editor): string {
  if (editor.isActive('heading', { level: 1 })) return 'h1'
  if (editor.isActive('heading', { level: 2 })) return 'h2'
  if (editor.isActive('heading', { level: 3 })) return 'h3'
  if (editor.isActive('heading', { level: 4 })) return 'h4'
  return 'paragraph'
}

// Turns an attribute value into text ('' when it is not set)
function toText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  return ''
}

// Reads the toolbar state from the editor. TipTap calls this after every change,
// and the toolbar only re-draws when something in the result is different.
export function readToolbarState(editor: Editor): EditorToolbarState {
  const textStyle = editor.getAttributes('textStyle')
  const highlight = editor.getAttributes('highlight')
  const link = editor.getAttributes('link')

  const isAlignCenter = editor.isActive({ textAlign: 'center' })
  const isAlignRight = editor.isActive({ textAlign: 'right' })
  const isAlignJustify = editor.isActive({ textAlign: 'justify' })

  return {
    blockType: getBlockType(editor),
    fontSize: toText(textStyle.fontSize),
    fontFamily: toText(textStyle.fontFamily),
    textColor: toText(textStyle.color),
    highlightColor: toText(highlight.color),
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
    isUnderline: editor.isActive('underline'),
    isStrike: editor.isActive('strike'),
    isCode: editor.isActive('code'),
    isSubscript: editor.isActive('subscript'),
    isSuperscript: editor.isActive('superscript'),
    isLink: editor.isActive('link'),
    linkUrl: toText(link.href),
    linkOpensInNewTab: link.target === '_blank',
    // Text is left-aligned unless another alignment is set
    isAlignLeft: !isAlignCenter && !isAlignRight && !isAlignJustify,
    isAlignCenter: isAlignCenter,
    isAlignRight: isAlignRight,
    isAlignJustify: isAlignJustify,
    isBulletList: editor.isActive('bulletList'),
    isOrderedList: editor.isActive('orderedList'),
    isTaskList: editor.isActive('taskList'),
    isBlockquote: editor.isActive('blockquote'),
    isCodeBlock: editor.isActive('codeBlock'),
    isInTable: editor.isActive('table'),
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
    canIndent: editor.can().sinkListItem('listItem') || editor.can().sinkListItem('taskItem'),
    canOutdent: editor.can().liftListItem('listItem') || editor.can().liftListItem('taskItem'),
  }
}
