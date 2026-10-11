export function slugify(text: string): string {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars except space and hyphen
    .replace(/\s+/g, '-')      // replace spaces with -
    .replace(/-+/g, '-')       // collapse duplicate dashes
    .replace(/^-+|-+$/g, '')   // trim leading/trailing dashes
}
