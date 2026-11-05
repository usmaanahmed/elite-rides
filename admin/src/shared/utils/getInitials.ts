// Turns a full name into up to two initials, e.g. 'Sarah Khan' -> 'SK'
export function getInitials(fullName: string): string {
  const words = fullName.trim().split(' ').filter((word) => word.length > 0)
  const firstLetters = words.slice(0, 2).map((word) => word[0].toUpperCase())
  return firstLetters.join('')
}
