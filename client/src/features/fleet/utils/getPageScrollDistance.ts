// How far the arrow buttons move the row of cards: as many whole cards as fit on screen,
// so no card is skipped. (At least one card.)
// The row must have `position: relative`, so each card's offsetLeft is measured from the row.
export function getPageScrollDistance(track: HTMLElement): number {
  const firstCard = track.children[0]
  const secondCard = track.children[1]
  if (!(firstCard instanceof HTMLElement) || !(secondCard instanceof HTMLElement)) {
    return track.clientWidth
  }

  // One card plus the gap after it
  const cardStep = secondCard.offsetLeft - firstCard.offsetLeft

  // Space for cards on screen = row width minus the empty space before the first card
  const visibleWidth = track.clientWidth - firstCard.offsetLeft

  let cardsPerPage = Math.floor(visibleWidth / cardStep)
  if (cardsPerPage < 1) {
    cardsPerPage = 1
  }

  return cardsPerPage * cardStep
}
