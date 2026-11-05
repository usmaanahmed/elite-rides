import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { SearchInput } from '../inputs/SearchInput'

export type DataTableColumn<Row> = {
  key: string
  header: string
  // The value this column is sorted and searched by. Leave it out for columns
  // that shouldn't be sorted or searched, like images or buttons.
  getValue?: (row: Row) => string | number
  // What the cell shows. Defaults to the column's value.
  render?: (row: Row) => ReactNode
  // Extra classes for this column's header and cells, e.g. a width
  className?: string
}

type SortState = {
  columnKey: string
  direction: 'asc' | 'desc'
}

type DataTableProps<Row> = {
  rows: Row[]
  columns: DataTableColumn<Row>[]
  // A unique, stable key for each row, usually its id
  getRowKey: (row: Row) => string
  // How the table is sorted when it first shows
  initialSort?: SortState
  pageSizeOptions?: number[]
  searchPlaceholder?: string
  className?: string
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  // numeric: true puts "Car 2" before "Car 10"
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

// Page numbers for the pagination bar, with null for a "…" gap, e.g. [1, null, 4, 5, 6, null, 12]
function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  const pages: (number | null)[] = [1]
  if (start > 2) pages.push(null)
  for (let page = start; page <= end; page++) pages.push(page)
  if (end < totalPages - 1) pages.push(null)
  pages.push(totalPages)
  return pages
}

// A table with a "Show N entries" picker, a search box, sortable columns and pagination.
// Everything happens in the browser, so it suits lists of up to a few thousand rows.
export function DataTable<Row>({
  rows,
  columns,
  getRowKey,
  initialSort,
  pageSizeOptions = [10, 25, 50, 100],
  searchPlaceholder = 'Search…',
  className = '',
}: DataTableProps<Row>) {
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(initialSort ?? null)
  const [page, setPage] = useState(1)

  // 1. Keep the rows where any searchable column contains the search text
  const searchText = search.trim().toLowerCase()
  const matchingRows = searchText
    ? rows.filter((row) =>
        columns.some((column) => column.getValue && String(column.getValue(row)).toLowerCase().includes(searchText)),
      )
    : rows

  // 2. Sort them by the chosen column
  const getSortValue = columns.find((column) => column.key === sort?.columnKey)?.getValue
  const sortedRows =
    sort && getSortValue
      ? [...matchingRows].sort((a, b) => {
          const result = compareValues(getSortValue(a), getSortValue(b))
          return sort.direction === 'asc' ? result : -result
        })
      : matchingRows

  // 3. Cut out the current page
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  // Rows can disappear (e.g. after a delete), so never stay on a page that no longer exists
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * pageSize
  const pageRows = sortedRows.slice(firstIndex, firstIndex + pageSize)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handlePageSizeChange(value: string) {
    setPageSize(Number(value))
    setPage(1)
  }

  // First click sorts A→Z (or low→high), the next click flips it
  function handleSort(columnKey: string) {
    setSort((current) => ({
      columnKey,
      direction: current?.columnKey === columnKey && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <label className="flex items-center gap-2 text-sm text-muted">
          Show
          <select
            value={pageSize}
            onChange={(event) => handlePageSizeChange(event.target.value)}
            className="h-10 rounded-xl border border-line bg-surface px-2.5 text-sm font-medium text-ink outline-none transition-all focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          entries
        </label>
        <SearchInput
          placeholder={searchPlaceholder}
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-72"
        />
      </div>

      {/* Scrolls sideways on small screens instead of squashing the columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-line bg-surface-muted">
            <tr>
              {columns.map((column) => {
                const sortDirection = sort?.columnKey === column.key ? sort.direction : null
                const SortIcon = sortDirection === 'asc' ? ArrowUp : sortDirection === 'desc' ? ArrowDown : ArrowUpDown

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted first:pl-5 last:pr-5 ${column.className ?? ''}`}
                  >
                    {column.getValue ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="group inline-flex items-center gap-1.5 uppercase tracking-wide transition-colors hover:text-ink"
                      >
                        {column.header}
                        <SortIcon
                          className={`size-3.5 ${sortDirection ? 'text-accent' : 'text-muted/50 group-hover:text-muted'}`}
                          strokeWidth={2}
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pageRows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-surface-muted">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 align-middle text-ink first:pl-5 last:pr-5 ${column.className ?? ''}`}
                  >
                    {column.render ? column.render(row) : column.getValue?.(row)}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-muted">
                  {rows.length === 0 ? 'No data available' : 'No matching records found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm text-muted">
          Showing <span className="font-medium text-ink">{sortedRows.length === 0 ? 0 : firstIndex + 1}</span> to{' '}
          <span className="font-medium text-ink">{firstIndex + pageRows.length}</span> of{' '}
          <span className="font-medium text-ink">{sortedRows.length}</span> entries
          {searchText && ` (filtered from ${rows.length} total)`}
        </p>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <PageArrowButton
            icon={ChevronLeft}
            label="Previous page"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {getPageNumbers(currentPage, totalPages).map((pageNumber, index) =>
            pageNumber === null ? (
              <span key={`gap-${index}`} className="px-1 text-sm text-muted">
                …
              </span>
            ) : (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
                className={`grid size-9 place-items-center rounded-lg text-sm font-medium tabular-nums transition-colors ${
                  pageNumber === currentPage ? 'bg-accent text-white' : 'text-muted hover:bg-nav-hover hover:text-ink'
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}
          <PageArrowButton
            icon={ChevronRight}
            label="Next page"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </nav>
      </div>
    </div>
  )
}

type PageArrowButtonProps = {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled: boolean
}

function PageArrowButton({ icon: Icon, label, onClick, disabled }: PageArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-nav-hover hover:text-ink disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon className="size-4" strokeWidth={2} />
    </button>
  )
}
