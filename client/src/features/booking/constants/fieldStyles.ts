// Shared look for every input/select inside a FieldBox or LocationRow.
// The control fills the whole box: `pl-12` leaves room for the icon on the left,
// `pt-5` leaves room for the small label at the top.
// Right padding is not included — each control adds its own, because each needs a different amount.
// 16px text on phones (`text-base`) stops iPhones from zooming in when the field is tapped.
export const FIELD_CONTROL_CLASSES =
  'h-full w-full rounded-2xl bg-transparent pl-12 pt-5 text-base font-medium text-ink outline-none placeholder:font-normal placeholder:text-muted/60 sm:text-[15px]'

// Small uppercase label shown at the top of each field box
export const FIELD_LABEL_CLASSES =
  'pointer-events-none absolute left-12 top-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]'
