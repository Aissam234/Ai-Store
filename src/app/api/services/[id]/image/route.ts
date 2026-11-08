import { getDb } from "@/server/db";
import { validService } from "@/server/service-images";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 if(!validService(id)) return new Response(null,{status:404});
 const row=await getDb().serviceImage.findUnique({where:{serviceId:id}});
 const theme=new URL(request.url).searchParams.get('theme');
 const bytes=(theme==='dark'?row?.imageDarkData:theme==='light'?row?.imageLightData:null)??row?.imageData;
 if(!bytes) return new Response(null,{status:404});
 return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'image/webp','Cache-Control':'private, no-cache','X-Content-Type-Options':'nosniff'}});
}
