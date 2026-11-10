import Papa from 'papaparse'

// Reads a CSV file and gives back its rows as objects keyed by the header row,
// e.g. a file with header "address,type" gives back [{ address: '...', type: '...' }, ...]
export function parseCsvFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    })
  })
}
