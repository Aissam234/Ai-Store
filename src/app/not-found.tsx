import { T } from "@/components/locale-provider";
import { Icon } from "@/components/icon";
import Link from "next/link";
export default function NotFound() { return <div className="container empty-state page-space"><span className="eyebrow"><T text="404 / A SMALL DETOUR"/></span><h1><T text="This page is out of the collection."/></h1><p><T text="The link may have changed, or this product isn’t available."/></p><Link className="button primary" href="/products"><T text="Back to the collection"/> <Icon name="arrow"/></Link></div>; }
