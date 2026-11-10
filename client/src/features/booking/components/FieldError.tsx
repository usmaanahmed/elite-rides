import { CircleAlert } from 'lucide-react'

type FieldErrorProps = {
  // Matches the aria-describedby on the input, so screen readers read the message with the field
  id: string
  message?: string
}

// Red validation message shown under a field. Shows nothing when there is no message.
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 pl-1 text-xs font-medium text-danger">
      <CircleAlert className="size-3.5 shrink-0" strokeWidth={2} />
      {message}
    </p>
  )
}
