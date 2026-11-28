import { SquarePen, Trash2 } from 'lucide-react'
import { IconButton } from '../../../shared/components/buttons/IconButton'
import { DataTable, type DataTableColumn } from '../../../shared/components/tables/DataTable'
import type { Faq } from '../types/faq'

type FaqsTableProps = {
  faqs: Faq[]
  onEdit: (faq: Faq) => void
  onDelete: (faq: Faq) => void
}

// All FAQs as a searchable table (question, answer, edit / delete buttons)
export function FaqsTable({ faqs, onEdit, onDelete }: FaqsTableProps) {
  const columns: DataTableColumn<Faq>[] = [
    {
      key: 'question',
      header: 'Question',
      getValue: (row) => row.question,
      render: (row) => <span className="font-semibold text-ink">{row.question}</span>,
    },
    {
      key: 'answer',
      header: 'Answer',
      getValue: (row) => row.answer,
      render: (row) => <span className="line-clamp-2 max-w-lg text-muted">{row.answer}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1">
          <IconButton icon={SquarePen} label="Edit FAQ" onClick={() => onEdit(row)} />
          <IconButton icon={Trash2} label="Delete FAQ" onClick={() => onDelete(row)} />
        </div>
      ),
      className: 'w-24',
    },
  ]

  return <DataTable rows={faqs} columns={columns} getRowKey={(row) => row.id} searchPlaceholder="Search FAQs…" />
}
