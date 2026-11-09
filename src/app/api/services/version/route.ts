import { connection } from "next/server";
import { getDb } from "@/server/db";
import { catalogVersion } from "@/lib/catalog-version";
export async function GET() {
 await connection();
 const headers={"Cache-Control":"no-store"};
 try {
  const rows=await getDb().serviceImage.findMany({select:{serviceId:true,updatedAt:true}});
  return Response.json({version:catalogVersion(rows.map(row=>({id:row.serviceId,updatedAt:row.updatedAt})),[])},{headers});
 } catch {return Response.json({error:"Service images temporarily unavailable"},{status:503,headers});}
}
