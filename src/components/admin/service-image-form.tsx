"use client";
import { useActionState,useEffect,useState } from 'react';
import Image from 'next/image';
import { saveServiceImages } from '@/actions/service-images';
function Upload({name,label,src}:{name:string;label:string;src?:string}) {
 const [preview,setPreview]=useState(src);const [failed,setFailed]=useState(false);
 useEffect(()=>()=>{if(preview?.startsWith('blob:'))URL.revokeObjectURL(preview)},[preview]);
 return <fieldset className="translation-group"><legend>{label}</legend><label>JPEG, PNG or WebP · maximum 3 MB<input type="file" name={name} accept="image/jpeg,image/png,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.setCustomValidity(file&&file.size>3*1024*1024?'Maximum 3 MB per image.':'');e.target.reportValidity();setFailed(false);setPreview(file?URL.createObjectURL(file):src)}}/></label>{preview&&!failed&&<div className="upload-preview"><Image src={preview} unoptimized width={360} height={240} alt={label} onError={()=>setFailed(true)}/></div>}<label className="checkbox-row"><input type="checkbox" name={'remove-'+name}/>Remove saved image (new upload takes priority)</label></fieldset>;
}
export function ServiceImageForm({id,name,src}:{id:string;name:string;src?:string}) {
 const [state,action,pending]=useActionState(async (previous:{message:string;ok:boolean},form:FormData)=>{try{return await saveServiceImages(id,previous,form)}catch{return {message:'Upload could not be completed. Your selected images are still here. Please retry.',ok:false}}},{message:'',ok:false});
 return <form action={action} className="panel"><h2>{name}</h2><p>Theme images fall back to the default image, then to the original illustration.</p><Upload key={src} name="imageData" label="Default image" src={src}/><Upload key={src} name="imageLightData" label="Light mode image" src={src?src+'&theme=light':undefined}/><Upload key={src} name="imageDarkData" label="Night mode image" src={src?src+'&theme=dark':undefined}/>{state.message&&<p role="status">{state.message}</p>}<button className="button primary" disabled={pending}>{pending?'Saving…':'Save changes'}</button></form>;
}
