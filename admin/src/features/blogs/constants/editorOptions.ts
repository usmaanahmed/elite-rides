import type { SelectOption } from '../../../shared/components/inputs/SelectInput'

// The "Paragraph / Heading" picker in the toolbar
export const BLOCK_TYPE_OPTIONS: SelectOption[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
]

// The text size picker ('' = the normal size)
export const FONT_SIZE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Size' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '30px', label: '30' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
]

// The font picker ('' = the website's normal font)
export const FONT_FAMILY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Font' },
  { value: 'Georgia, serif', label: 'Serif' },
  { value: 'Arial, Helvetica, sans-serif', label: 'Sans serif' },
  { value: '"Courier New", monospace', label: 'Monospace' },
]

// Ready-made text colours (the admin can also pick any custom colour)
export const TEXT_COLORS: string[] = [
  '#0d1017',
  '#4b5563',
  '#9ca3af',
  '#dc2626',
  '#ea580c',
  '#fc6203',
  '#ca8a04',
  '#16a34a',
  '#0d9488',
  '#2563eb',
  '#7c3aed',
  '#db2777',
]

// Soft background colours for highlighting text
export const HIGHLIGHT_COLORS: string[] = [
  '#fef08a',
  '#fde68a',
  '#fed7aa',
  '#fecaca',
  '#fbcfe8',
  '#e9d5ff',
  '#bfdbfe',
  '#a5f3fc',
  '#bbf7d0',
  '#e5e7eb',
]
