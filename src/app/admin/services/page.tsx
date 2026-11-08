import { requireAdmin } from '@/server/auth';
import { serviceImageSources } from '@/server/service-images';
import { services } from '@/data/software-services';
import { ServiceImageForm } from '@/components/admin/service-image-form';
export default async function AdminServices(){await requireAdmin();const sources=await serviceImageSources();return <section><h1>Software Services images</h1><div className="admin-form">{services.map(service=><ServiceImageForm key={service.id} id={service.id} name={service.name} src={sources[service.id]}/>)}</div></section>}
