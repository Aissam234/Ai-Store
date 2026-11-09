"use client";
import { ProductImage } from "./product-image";
import { ServiceArtwork } from "./service-artwork";
export function ServiceImage({id,src,name}:{id:string;src?:string;name:string}) {
 return <div className="studio-service-image">{src?<ProductImage key={src} src={src} darkSrc={src+'&theme=dark'} lightSrc={src+'&theme=light'} name={name}><ServiceArtwork variant={id}/></ProductImage>:<ServiceArtwork variant={id}/>}</div>;
}
