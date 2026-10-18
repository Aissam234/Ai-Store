import Link from "next/link";
export function Pagination({ page, count, pageSize, href }: { page: number; count: number; pageSize: number; href: string }) {
  return <nav className="pagination" aria-label="Pagination"><span className="small">{count} records · Page {page} of {Math.max(1, Math.ceil(count / pageSize))}</span><div>{page > 1 && <Link className="button secondary" href={`${href}?page=${page - 1}`}>← Previous</Link>}{page * pageSize < count && <Link className="button secondary" href={`${href}?page=${page + 1}`}>Next →</Link>}</div></nav>;
}
