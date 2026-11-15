// Where the arrow buttons move the row of cards to: one "page" of cards forwards (direction 1)
// or backwards (direction -1), landing exactly on the start of a card so it lines up with the page.
// The row must have `position: relative`, so each card's offsetLeft is measured from the row.
export function getPageScrollTarget(track: HTMLElement, direction: number): number {
  const firstCard = track.children[0]
  const secondCard = track.children[1]
  if (!(firstCard instanceof HTMLElement) || !(secondCard instanceof HTMLElement)) {
    return track.scrollLeft + direction * track.clientWidth
  }

  // One card plus the gap after it. Card number N lines up with the page when scrollLeft = N × cardStep.
  const cardStep = secondCard.offsetLeft - firstCard.offsetLeft

  // How many whole cards fit on screen (at least one), so no card is skipped
  const visibleWidth = track.clientWidth - firstCard.offsetLeft
  let cardsPerPage = Math.floor(visibleWidth / cardStep)
  if (cardsPerPage < 1) {
    cardsPerPage = 1
  }

  // The card lined up right now. Rounded, because the auto-scroll can leave the row between two cards.
  const currentCard = Math.round(track.scrollLeft / cardStep)
  const targetCard = currentCard + direction * cardsPerPage

  // (The browser stops at the start / end of the row by itself if this goes past either end)
  return targetCard * cardStep
}
