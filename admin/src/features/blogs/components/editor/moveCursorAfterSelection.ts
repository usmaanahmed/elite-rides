import { Selection } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'

// After an image or video is added, TipTap leaves it selected, so the next key press
// (or a new table) would replace it. This puts the text cursor just after it instead.
export function moveCursorAfterSelection(editor: Editor): void {
  const state = editor.state
  const placeAfter = state.doc.resolve(state.selection.to)

  // The first spot after the image where text can be typed (true = text spots only)
  const cursorSpot = Selection.findFrom(placeAfter, 1, true)
  if (cursorSpot) {
    editor.view.dispatch(state.tr.setSelection(cursorSpot))
  }
}
