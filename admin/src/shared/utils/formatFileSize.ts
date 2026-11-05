// Turns a size in bytes into short readable text, e.g. 348160 -> "340 KB", 2621440 -> "2.5 MB"
export function formatFileSize(bytes: number): string {
  const oneMegabyte = 1024 * 1024
  if (bytes < oneMegabyte) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / oneMegabyte).toFixed(1)} MB`
}
