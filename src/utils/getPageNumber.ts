import { SITE } from "@config";

export function getPageNumbers(
  totalItems: number,
  pageSize: number = SITE.postPerPage
): number[] {
  const totalPages = Math.ceil(totalItems / pageSize);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}
