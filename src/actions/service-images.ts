"use server";
import { requireAdmin } from "@/server/auth";
import { getDb } from "@/server/db";
import { validService } from "@/server/service-images";
import { normalizeProductImage } from "@/server/product-image";
import { revalidatePath } from "next/cache";
export async function saveServiceImages(id:string,_previous:{message:string;ok:boolean},form:FormData) {
 await requireAdmin();
 if(!validService(id)) return {message:'Invalid service.',ok:false};
 const data: {imageData?:Uint8Array<ArrayBuffer>|null;imageDarkData?:Uint8Array<ArrayBuffer>|null;imageLightData?:Uint8Array<ArrayBuffer>|null}={};
 try {
  for(const key of ['imageData','imageDarkData','imageLightData'] as const) {
   const file=form.get(key);
   if(file instanceof File && file.size) data[key]=await normalizeProductImage(file);
   else if(form.get('remove-'+key)==='on') data[key]=null;
  }
 } catch { return {message:'Choose a valid JPEG, PNG or WebP image up to 3 MB (maximum 25 megapixels).',ok:false}; }
 try { await getDb().serviceImage.upsert({where:{serviceId:id},create:{serviceId:id,...data},update:data}); }
 catch {return {message:'Could not save images. Please try again.',ok:false};}
 revalidatePath('/software-services');revalidatePath('/admin/services');
 return {message:'Images saved.',ok:true};
}
