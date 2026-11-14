import { useEditorState, type Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code,
  Highlighter,
  ImagePlus,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link,
  List,
  ListOrdered,
  ListTodo,
  Maximize2,
  Minimize2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline,
  Undo2,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import {
  BLOCK_TYPE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  HIGHLIGHT_COLORS,
  TEXT_COLORS,
} from '../../constants/editorOptions'
import { ColorMenu } from './ColorMenu'
import { readToolbarState } from './editorToolbarState'
import { ImageDialog } from './ImageDialog'
import { LinkDialog } from './LinkDialog'
import { moveCursorAfterSelection } from './moveCursorAfterSelection'
import { TableToolbar } from './TableToolbar'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarDivider } from './ToolbarDivider'
import { ToolbarSelect } from './ToolbarSelect'
import { VideoDialog } from './VideoDialog'

type EditorToolbarProps = {
  editor: Editor
  onUploadImage: (file: File) => Promise<string>
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

// Which dialog is open, if any
type OpenDialog = 'none' | 'link' | 'image' | 'video'

// The row of formatting buttons above the blog editor
export function EditorToolbar({ editor, onUploadImage, isFullscreen, onToggleFullscreen }: EditorToolbarProps) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>('none')

  // Re-draws the toolbar whenever the text at the cursor changes (e.g. it becomes bold)
  const state = useEditorState({
    editor: editor,
    selector: (context) => readToolbarState(context.editor),
  })

  // A new link opens in a new tab by default; an existing link keeps its own setting
  let linkOpensInNewTab = true
  if (state.linkUrl !== '') {
    linkOpensInNewTab = state.linkOpensInNewTab
  }

  function closeDialog() {
    setOpenDialog('none')
  }

  function changeBlockType(value: string) {
    if (value === 'h1') {
      editor.chain().focus().setHeading({ level: 1 }).run()
    } else if (value === 'h2') {
      editor.chain().focus().setHeading({ level: 2 }).run()
    } else if (value === 'h3') {
      editor.chain().focus().setHeading({ level: 3 }).run()
    } else if (value === 'h4') {
      editor.chain().focus().setHeading({ level: 4 }).run()
    } else {
      editor.chain().focus().setParagraph().run()
    }
  }

  function changeFontSize(value: string) {
    if (value === '') {
      editor.chain().focus().unsetFontSize().run()
    } else {
      editor.chain().focus().setFontSize(value).run()
    }
  }

  function changeFontFamily(value: string) {
    if (value === '') {
      editor.chain().focus().unsetFontFamily().run()
    } else {
      editor.chain().focus().setFontFamily(value).run()
    }
  }

  // Lists and checklists use different item types, so indent whichever one the cursor is in
  function indentListItem() {
    if (editor.isActive('taskItem')) {
      editor.chain().focus().sinkListItem('taskItem').run()
    } else {
      editor.chain().focus().sinkListItem('listItem').run()
    }
  }

  function outdentListItem() {
    if (editor.isActive('taskItem')) {
      editor.chain().focus().liftListItem('taskItem').run()
    } else {
      editor.chain().focus().liftListItem('listItem').run()
    }
  }

  // A dialog took the focus away from the text. Give it back straight away (TipTap's focus() waits
  // a frame), otherwise the closing dialog puts the cursor back at an old spot.
  function focusTextNow() {
    editor.view.focus()
  }

  function saveLink(url: string, openInNewTab: boolean) {
    let target: string | null = null
    if (openInNewTab) {
      target = '_blank'
    }

    focusTextNow()
    const hasSelectedText = !editor.state.selection.empty
    if (hasSelectedText || editor.isActive('link')) {
      // Put the link on the selected text (or update the link the cursor is on)
      editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: target }).run()
    } else {
      // Nothing selected: write the address itself as a link
      editor
        .chain()
        .focus()
        .insertContent({ type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url, target: target } }] })
        .run()
    }
    closeDialog()
  }

  function removeLink() {
    focusTextNow()
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    closeDialog()
  }

  function insertImage(src: string, altText: string) {
    focusTextNow()
    editor.chain().focus().setImage({ src: src, alt: altText }).run()
    moveCursorAfterSelection(editor)
    closeDialog()
  }

  function insertVideo(youtubeUrl: string) {
    focusTextNow()
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
    moveCursorAfterSelection(editor)
    closeDialog()
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div>
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <ToolbarButton icon={Undo2} label="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} />
        <ToolbarButton icon={Redo2} label="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} />
        <ToolbarDivider />

        <ToolbarSelect label="Text style" options={BLOCK_TYPE_OPTIONS} value={state.blockType} onChange={changeBlockType} widthClass="w-32" />
        <ToolbarSelect label="Font" options={FONT_FAMILY_OPTIONS} value={state.fontFamily} onChange={changeFontFamily} widthClass="w-28" />
        <ToolbarSelect label="Text size" options={FONT_SIZE_OPTIONS} value={state.fontSize} onChange={changeFontSize} widthClass="w-20" />
        <ToolbarDivider />

        <ToolbarButton icon={Bold} label="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} isActive={state.isBold} />
        <ToolbarButton icon={Italic} label="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={state.isItalic} />
        <ToolbarButton icon={Underline} label="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={state.isUnderline} />
        <ToolbarButton icon={Strikethrough} label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={state.isStrike} />
        <ToolbarButton icon={Code} label="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} isActive={state.isCode} />
        <ToolbarButton icon={Subscript} label="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={state.isSubscript} />
        <ToolbarButton icon={Superscript} label="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={state.isSuperscript} />
        <ToolbarDivider />

        <ColorMenu
          icon={Baseline}
          label="Text colour"
          colors={TEXT_COLORS}
          currentColor={state.textColor}
          onPick={(color) => editor.chain().focus().setColor(color).run()}
          onClear={() => editor.chain().focus().unsetColor().run()}
        />
        <ColorMenu
          icon={Highlighter}
          label="Highlight"
          colors={HIGHLIGHT_COLORS}
          currentColor={state.highlightColor}
          onPick={(color) => editor.chain().focus().setHighlight({ color: color }).run()}
          onClear={() => editor.chain().focus().unsetHighlight().run()}
        />
        <ToolbarButton
          icon={RemoveFormatting}
          label="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        />
        <ToolbarDivider />

        <ToolbarButton icon={AlignLeft} label="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={state.isAlignLeft} />
        <ToolbarButton icon={AlignCenter} label="Align centre" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={state.isAlignCenter} />
        <ToolbarButton icon={AlignRight} label="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={state.isAlignRight} />
        <ToolbarButton icon={AlignJustify} label="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={state.isAlignJustify} />
        <ToolbarDivider />

        <ToolbarButton icon={List} label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={state.isBulletList} />
        <ToolbarButton icon={ListOrdered} label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={state.isOrderedList} />
        <ToolbarButton icon={ListTodo} label="Checklist" onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={state.isTaskList} />
        <ToolbarButton icon={IndentDecrease} label="Decrease indent" onClick={outdentListItem} disabled={!state.canOutdent} />
        <ToolbarButton icon={IndentIncrease} label="Increase indent" onClick={indentListItem} disabled={!state.canIndent} />
        <ToolbarDivider />

        <ToolbarButton icon={Quote} label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={state.isBlockquote} />
        <ToolbarButton icon={SquareCode} label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={state.isCodeBlock} />
        <ToolbarButton icon={Minus} label="Divider line" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <ToolbarDivider />

        <ToolbarButton icon={Link} label="Link" onClick={() => setOpenDialog('link')} isActive={state.isLink} />
        <ToolbarButton icon={ImagePlus} label="Image" onClick={() => setOpenDialog('image')} />
        <ToolbarButton icon={Video} label="YouTube video" onClick={() => setOpenDialog('video')} />
        <ToolbarButton icon={Table} label="Table" onClick={insertTable} isActive={state.isInTable} />

        {/* ml-auto pushes the full screen button to the right end */}
        <div className="ml-auto">
          <ToolbarButton
            icon={isFullscreen ? Minimize2 : Maximize2}
            label={isFullscreen ? 'Exit full screen (Esc)' : 'Full screen'}
            onClick={onToggleFullscreen}
          />
        </div>
      </div>

      {state.isInTable && <TableToolbar editor={editor} />}

      {openDialog === 'link' && (
        <LinkDialog
          initialUrl={state.linkUrl}
          initialOpenInNewTab={linkOpensInNewTab}
          onSave={saveLink}
          onRemove={removeLink}
          onClose={closeDialog}
        />
      )}
      {openDialog === 'image' && <ImageDialog onInsert={insertImage} onUploadImage={onUploadImage} onClose={closeDialog} />}
      {openDialog === 'video' && <VideoDialog onInsert={insertVideo} onClose={closeDialog} />}
    </div>
  )
}
