// Size of one photo in the airport gallery on wide screens.
// The gallery is a grid of 4 columns x 2 rows, and the first photo is always the big one:
//
//  1 photo:  [  1  1  1  1 ]     2 photos: [ 1 1 2 2 ]     3 photos: [ 1 1 2 2 ]
//            [  1  1  1  1 ]               [ 1 1 2 2 ]               [ 1 1 3 3 ]
//
//  4 photos: [ 1 1 2 2 ]         5 photos: [ 1 1 2 3 ]
//            [ 1 1 3 4 ]                   [ 1 1 4 5 ]
//
// index = place of the photo (0 = first). Gives Tailwind classes (only used from the `lg` size).
export function getGalleryTileClasses(index: number, imageCount: number): string {
  if (imageCount === 1) {
    return 'lg:col-span-4 lg:row-span-2'
  }
  if (imageCount === 2) {
    return 'lg:col-span-2 lg:row-span-2'
  }
  if (index === 0) {
    return 'lg:col-span-2 lg:row-span-2'
  }
  if (imageCount === 3) {
    return 'lg:col-span-2'
  }
  if (imageCount === 4 && index === 1) {
    return 'lg:col-span-2'
  }
  // Small square: one column, one row
  return ''
}
