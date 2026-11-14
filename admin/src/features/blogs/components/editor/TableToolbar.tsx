import type { Editor } from '@tiptap/react'
import { Table } from 'lucide-react'

type TableToolbarProps = {
  editor: Editor
}

type TableActionButtonProps = {
  label: string
  onClick: () => void
  isDanger?: boolean
}

// A small text button for one table action, e.g. "+ Row below"
function TableActionButton({ label, onClick, isDanger = false }: TableActionButtonProps) {
  const colorClasses = isDanger ? 'text-danger hover:bg-danger-soft' : 'text-ink hover:bg-nav-hover'

  return (
    <button
      type="button"
      onClick={onClick}
      // Keep the cursor inside the table while clicking
      onMouseDown={(event) => event.preventDefault()}
      className={`h-7 shrink-0 rounded-md px-2 text-xs font-medium transition-colors ${colorClasses}`}
    >
      {label}
    </button>
  )
}

// Extra buttons shown under the main toolbar while the cursor is inside a table
export function TableToolbar({ editor }: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-line bg-surface-muted px-2 py-1.5">
      <span className="mr-1 flex items-center gap-1.5 px-1 text-xs font-semibold text-muted">
        <Table className="size-3.5" strokeWidth={2} />
        Table
      </span>
      <TableActionButton label="+ Row above" onClick={() => editor.chain().focus().addRowBefore().run()} />
      <TableActionButton label="+ Row below" onClick={() => editor.chain().focus().addRowAfter().run()} />
      <TableActionButton label="− Row" onClick={() => editor.chain().focus().deleteRow().run()} />
      <TableActionButton label="+ Column left" onClick={() => editor.chain().focus().addColumnBefore().run()} />
      <TableActionButton label="+ Column right" onClick={() => editor.chain().focus().addColumnAfter().run()} />
      <TableActionButton label="− Column" onClick={() => editor.chain().focus().deleteColumn().run()} />
      <TableActionButton label="Merge / split cells" onClick={() => editor.chain().focus().mergeOrSplit().run()} />
      <TableActionButton label="Header row" onClick={() => editor.chain().focus().toggleHeaderRow().run()} />
      <TableActionButton label="Delete table" onClick={() => editor.chain().focus().deleteTable().run()} isDanger />
    </div>
  )
}
