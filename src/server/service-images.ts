import "server-only";
import { getDb } from "./db";
import { services } from "@/data/software-services";
export const validService = (id:string) => services.some(service => service.id === id);
export async function serviceImageSources() {
 const rows = await getDb().serviceImage.findMany({where:{OR:[{imageData:{not:null}},{imageDarkData:{not:null}},{imageLightData:{not:null}}]},select:{serviceId:true,updatedAt:true}});
 return Object.fromEntries(rows.map(row => [row.serviceId, '/api/services/'+row.serviceId+'/image?v='+row.updatedAt.getTime()]));
}
