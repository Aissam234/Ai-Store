import './load-env';
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
async function main() {
 const connectionString=process.env.DATABASE_URL;
 if(!connectionString) throw new Error('DATABASE_URL is required.');
 const db=new PrismaClient({adapter:new PrismaPg({connectionString,max:1})});
 try {
  const names=['website','applications','automation','mentorship','code-review'];
  for(const [index,name] of names.entries()) {
   const dark=new Uint8Array(await readFile(new URL('../assets/service-images/'+name+'-night.webp',import.meta.url)));
   const light=new Uint8Array(await readFile(new URL('../assets/service-images/'+name+'-light.webp',import.meta.url)));
   await db.serviceImage.upsert({where:{serviceId:String(index+1)},create:{serviceId:String(index+1),imageData:dark,imageDarkData:dark,imageLightData:light},update:{},select:{serviceId:true}});
  }
  console.log('Service artwork provisioned. Existing service image records were preserved.');
 } finally {await db.$disconnect();}
}
main().catch(()=>{console.error('Could not provision service artwork. Check database configuration and migrations.');process.exitCode=1;});
