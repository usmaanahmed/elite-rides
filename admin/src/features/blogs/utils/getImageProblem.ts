import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '../schemas/blogFormSchema'

// Checks an image before it is uploaded. Gives back what is wrong with it, or '' when it is fine.
export function getImageProblem(file: File): string {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" is not a JPG, PNG or WEBP image`
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `"${file.name}" is bigger than ${MAX_IMAGE_SIZE_MB} MB`
  }
  return ''
}
