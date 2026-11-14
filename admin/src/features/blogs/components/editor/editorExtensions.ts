import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { Color, FontFamily, FontSize, TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { StarterKit } from '@tiptap/starter-kit'

// Every feature the blog editor has. Each "extension" adds one feature to TipTap,
// e.g. Table adds tables and Youtube adds video embeds.
export function createEditorExtensions(placeholder: string) {
  return [
    // Paragraphs, headings, bold, italic, underline, strike, lists, quotes, code, links, undo/redo…
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: {
        // Clicking a link while writing should place the cursor, not open the page
        openOnClick: false,
        // Typing "www.site.com " turns it into a link automatically
        autolink: true,
        defaultProtocol: 'https',
      },
    }),

    // Text size, font and colour all live on "textStyle"
    TextStyle,
    FontSize,
    FontFamily,
    Color,
    // multicolor lets each highlight have its own colour
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Subscript,
    Superscript,

    // Checklists
    TaskList,
    TaskItem.configure({ nested: true }),

    // Images that can be resized by dragging their corners
    Image.configure({
      resize: {
        enabled: true,
        directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        minWidth: 80,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      },
    }),

    // YouTube videos (the "nocookie" address doesn't track visitors)
    Youtube.configure({ nocookie: true, width: 640, height: 360 }),

    // Tables whose columns can be resized by dragging
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,

    // Grey hint text while the editor is empty
    Placeholder.configure({ placeholder: placeholder }),
    // Counts words and characters for the status bar
    CharacterCount,
  ]
}
