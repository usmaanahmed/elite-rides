type SwitchProps = {
  isOn: boolean
}

// iOS-style on/off switch. It is only the picture of a switch:
// place it inside a button that does the actual toggling.
export function Switch({ isOn }: SwitchProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-[30px] w-[50px] shrink-0 rounded-full transition-colors duration-200 ${isOn ? 'bg-accent' : 'bg-line'}`}
    >
      <span
        className={`absolute left-[3px] top-[3px] size-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-transform duration-200 ${isOn ? 'translate-x-5' : ''}`}
      />
    </span>
  )
}
