// Puts one value into CSV format. Values with commas, quotes or new lines are wrapped in quotes.
function toCsvCell(value: string | number): string {
  const text = String(value)
  const needsQuotes = text.includes(',') || text.includes('"') || text.includes('\n')
  if (needsQuotes) {
    return '"' + text.replace(/"/g, '""') + '"'
  }
  return text
}

// Builds a CSV file from a header row and data rows, and downloads it in the browser
export function downloadCsv(fileName: string, header: string[], rows: (string | number)[][]) {
  const lines: string[] = [header.map(toCsvCell).join(',')]
  for (const row of rows) {
    lines.push(row.map(toCsvCell).join(','))
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()

  URL.revokeObjectURL(url)
}
