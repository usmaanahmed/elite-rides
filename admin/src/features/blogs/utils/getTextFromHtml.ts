// Removes the HTML tags and gives back only the written text,
// e.g. "<p>Hello <strong>world</strong></p>" -> "Hello world"
export function getTextFromHtml(html: string): string {
  const htmlDocument = new DOMParser().parseFromString(html, 'text/html')
  return htmlDocument.body.textContent ?? ''
}
