import { Icon } from "@/components/icon";
import Link from "next/link";
export default function NotFound() { return <div className="container empty-state page-space"><span className="eyebrow">404 / A SMALL DETOUR</span><h1>This page is out of the collection.</h1><p>The link may have changed, or this product isn’t available.</p><Link className="button primary" href="/products">Back to the collection <Icon name="arrow"/></Link></div>; }
