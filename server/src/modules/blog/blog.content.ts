// Blog ke HTML content ke chhote helpers: saaf karna, text nikalna, reading time, images
import sanitizeHtml from "sanitize-html";

// Ek minute me itne words parhe jaate hain (reading time ke liye)
const WORDS_PER_MINUTE = 200;

// CSS colours jo allowed hain, e.g. "#fc6203", "rgb(0, 0, 0)", "red" ya "inherit"
const allowedColors = [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i, /^[a-z]+$/i];
// Size jaise "18px", "1.5em", "50%"
const allowedSizes = [/^\d{1,4}(\.\d+)?(px|em|rem|%)$/];

// Rich text editor jo tags/attributes banata hai, sirf wohi allowed hain.
// Baqi sab (e.g. <script>, onclick, javascript: links) hata diye jaate hain.
const blogHtmlRules: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "del", "sub", "sup", "mark", "span", "code", "pre",
    "a", "ul", "ol", "li", "blockquote", "hr", "img",
    "table", "colgroup", "col", "thead", "tbody", "tr", "th", "td",
    // YouTube video ka dabba aur checklist ka checkbox
    "div", "iframe", "label", "input",
  ],
  allowedAttributes: {
    "*": ["style"],
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    iframe: ["src", "width", "height", "allowfullscreen", "frameborder", "allow"],
    div: ["data-youtube-video"],
    ul: ["data-type"],
    li: ["data-type", "data-checked"],
    ol: ["start", "type"],
    input: ["type", "checked", "disabled"],
    mark: ["data-color"],
    th: ["colspan", "rowspan", "colwidth"],
    td: ["colspan", "rowspan", "colwidth"],
    col: ["span"],
    code: ["class"],
  },
  // Code block ki language, e.g. class="language-js"
  allowedClasses: { code: ["language-*"] },
  // style="" me sirf yeh cheezein rehti hain
  allowedStyles: {
    "*": {
      color: allowedColors,
      "background-color": allowedColors,
      "text-align": [/^(left|right|center|justify)$/],
      "font-size": allowedSizes,
      "font-family": [/^[\w\s,"'-]+$/],
      width: allowedSizes,
      "min-width": allowedSizes,
      height: allowedSizes,
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Iframe sirf YouTube ka
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
};

// HTML me se khatarnak cheezein hata kar saaf HTML wapas deta hai
export function cleanBlogContent(html: string): string {
  return sanitizeHtml(html, blogHtmlRules);
}

// HTML ke saare tags hata kar sirf likha hua text deta hai
export function getPlainText(html: string): string {
  // Block tags ke baad space daalo, warna "<p>one</p><p>two</p>" -> "onetwo" ban jaata
  const htmlWithSpaces = html.replace(/<\/(p|h[1-6]|li|td|th|blockquote|pre|div)>/g, " </$1>").replace(/<br\s*\/?>/g, " ");
  return sanitizeHtml(htmlWithSpaces, { allowedTags: [], allowedAttributes: {} });
}

// Kya blog me kuch likha hai ya koi image/video lagi hai?
export function hasBlogContent(html: string): boolean {
  if (getPlainText(html).trim() !== "") {
    return true;
  }
  return html.includes("<img") || html.includes("<iframe");
}

// Blog parhne me kitne minute lagenge (kam se kam 1)
export function getReadingTimeMinutes(html: string): number {
  const words = getPlainText(html).split(/\s+/);

  let wordCount = 0;
  for (const word of words) {
    if (word !== "") {
      wordCount = wordCount + 1;
    }
  }

  const minutes = Math.round(wordCount / WORDS_PER_MINUTE);
  if (minutes < 1) {
    return 1;
  }
  return minutes;
}

// Content me lagi hui humari upload ki hui images ke file names
// e.g. '<img src="http://localhost:5000/uploads/blogs/1700000000-123.jpg">' -> ["1700000000-123.jpg"]
export function getContentImageFileNames(html: string): string[] {
  const fileNames: string[] = [];
  // Multer file ka naam "number-number.ext" rakhta hai (dekho middlewares/upload.ts)
  const imagePathPattern = /\/uploads\/blogs\/(\d+-\d+\.[a-z0-9]+)/g;

  for (const match of html.matchAll(imagePathPattern)) {
    const fileName = match[1];
    if (!fileNames.includes(fileName)) {
      fileNames.push(fileName);
    }
  }
  return fileNames;
}
