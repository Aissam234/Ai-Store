import { Pagination } from "@/components/admin/pagination";
import { adminUsers, PAGE_SIZE, pageNumber } from "@/server/admin";

export default async function UsersAdmin({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const page = pageNumber((await searchParams).page);
  const { rows, count } = await adminUsers(page);

  return <>
    <div className="section-heading"><h1 className="admin-title">My Users</h1></div>
    <div className="table-scroll">
      <table className="admin-table">
        <caption className="sr-only">Registered accounts, newest first</caption>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
        <tbody>{rows.map(user => (
          <tr key={user.id}>
            <td><bdi>{user.name}</bdi></td>
            <td dir="ltr">{user.email}</td>
            <td>{user.role === "ADMIN" ? "Administrator" : "Customer"}</td>
            <td><time dateTime={user.createdAt.toISOString()}>{user.createdAt.toISOString().slice(0, 10)}</time></td>
          </tr>
        ))}</tbody>
      </table>
      {!rows.length && <p className="panel">No users on this page.</p>}
    </div>
    <Pagination page={page} count={count} pageSize={PAGE_SIZE} href="/admin/users"/>
  </>;
}
