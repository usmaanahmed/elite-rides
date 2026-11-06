import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { SearchInput } from '../inputs/SearchInput'

export type DataTableColumn<Row extends RowData> = {
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

type DataTableProps<Row extends RowData> = {
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

// The TanStack Table features this table uses: searching, sorting and pagination
const tableFeatureList = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
})

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

// Turns one of our simple column descriptions into a TanStack Table column
function createTableColumn<Row extends RowData>(column: DataTableColumn<Row>): ColumnDef<typeof tableFeatureList, Row, unknown> {
  const getValue = column.getValue

  // Shows the custom render if there is one, otherwise the plain value
  function renderCell(row: Row): ReactNode {
    if (column.render) return column.render(row)
    if (getValue) return getValue(row)
    return null
  }

  // Columns like images or buttons have no value, so they can't be sorted or searched
  if (!getValue) {
    return {
      id: column.key,
      header: column.header,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => renderCell(info.row.original),
    }
  }

  return {
    id: column.key,
    header: column.header,
    accessorFn: getValue,
    // First click sorts A→Z (or low→high), the next click flips it
    sortDescFirst: false,
    cell: (info) => renderCell(info.row.original),
  }
}

// A table with a "Show N entries" picker, a search box, sortable columns and pagination.
// Everything happens in the browser, so it suits lists of up to a few thousand rows.
// Built with TanStack Table.
export function DataTable<Row extends RowData>({
  rows,
  columns,
  getRowKey,
  initialSort,
  pageSizeOptions = [10, 25, 50, 100],
  searchPlaceholder = 'Search…',
  className = '',
}: DataTableProps<Row>) {
  const [search, setSearch] = useState('')

  const table = useTable({
    features: tableFeatureList,
    columns: columns.map(createTableColumn),
    data: rows,
    getRowId: getRowKey,
    globalFilterFn: 'includesString',
    enableSortingRemoval: false,
    enableMultiSort: false,
    initialState: {
      sorting: initialSort ? [{ id: initialSort.columnKey, desc: initialSort.direction === 'desc' }] : [],
      pagination: { pageIndex: 0, pageSize: pageSizeOptions[0] },
    },
  })

  const pageSize = table.state.pagination.pageSize
  const currentPage = table.state.pagination.pageIndex + 1
  const totalPages = Math.max(1, table.getPageCount())

  // The rows left after searching and sorting (all pages), and the rows on this page
  const matchingRowCount = table.getPrePaginatedRowModel().rows.length
  const pageRows = table.getRowModel().rows
  const firstIndex = (currentPage - 1) * pageSize
  const searchText = search.trim()

  function handleSearchChange(value: string) {
    setSearch(value)
    table.setGlobalFilter(value.trim())
    table.setPageIndex(0)
  }

  function handlePageSizeChange(value: string) {
    table.setPageSize(Number(value))
    table.setPageIndex(0)
  }

  // Finds the extra classes (like a width) a column asked for
  function getColumnClassName(columnKey: string): string {
    const column = columns.find((item) => item.key === columnKey)
    return column?.className ?? ''
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted()
                  let SortIcon = ArrowUpDown
                  let ariaSort: 'ascending' | 'descending' | undefined = undefined
                  if (sortDirection === 'asc') {
                    SortIcon = ArrowUp
                    ariaSort = 'ascending'
                  } else if (sortDirection === 'desc') {
                    SortIcon = ArrowDown
                    ariaSort = 'descending'
                  }

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={ariaSort}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted first:pl-5 last:pr-5 ${getColumnClassName(header.column.id)}`}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="group inline-flex items-center gap-1.5 uppercase tracking-wide transition-colors hover:text-ink"
                        >
                          <table.FlexRender header={header} />
                          <SortIcon
                            className={`size-3.5 ${sortDirection ? 'text-accent' : 'text-muted/50 group-hover:text-muted'}`}
                            strokeWidth={2}
                          />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-line">
            {pageRows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-surface-muted">
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 align-middle text-ink first:pl-5 last:pr-5 ${getColumnClassName(cell.column.id)}`}
                  >
                    <table.FlexRender cell={cell} />
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
          Showing <span className="font-medium text-ink">{matchingRowCount === 0 ? 0 : firstIndex + 1}</span> to{' '}
          <span className="font-medium text-ink">{firstIndex + pageRows.length}</span> of{' '}
          <span className="font-medium text-ink">{matchingRowCount}</span> entries
          {searchText && ` (filtered from ${rows.length} total)`}
        </p>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <PageArrowButton
            icon={ChevronLeft}
            label="Previous page"
            onClick={() => table.setPageIndex(currentPage - 2)}
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
                onClick={() => table.setPageIndex(pageNumber - 1)}
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
            onClick={() => table.setPageIndex(currentPage)}
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
