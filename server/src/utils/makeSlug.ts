// Text ko URL ke liye slug me badalta hai
// e.g. "Heathrow Airport: Top 5 Tips!" -> "heathrow-airport-top-5-tips"
export function makeSlug(text: string): string {
  let slug = text.toLowerCase().trim();

  // "café" jaise letters ko simple "cafe" bana do
  slug = slug.normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Apostrophe hata do, taake "driver's" -> "drivers" bane (na ke "driver-s")
  slug = slug.replace(/['’]/g, "");

  // Letters aur numbers ke ilawa har cheez ko "-" bana do
  slug = slug.replace(/[^a-z0-9]+/g, "-");

  // Shuru aur aakhir ke "-" hata do
  slug = slug.replace(/^-+/, "").replace(/-+$/, "");

  return slug;
}
