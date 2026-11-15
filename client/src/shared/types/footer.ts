// The social networks the footer has a logo for
export type SocialNetwork = 'instagram' | 'facebook' | 'x' | 'linkedin'

// One round social button in the footer, e.g. Instagram
export type SocialLink = {
  network: SocialNetwork
  // Network name for screen readers, e.g. "Instagram"
  label: string
  href: string
}
