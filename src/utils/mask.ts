// Masks a Korean name for sharing, e.g. "류준영" -> "류**".
export function maskName(name: string): string {
  if (!name) return '수강생';
  if (name.length <= 1) return name;
  return name[0] + '*'.repeat(name.length - 1);
}
