import type { ReactNode } from "react";
import { T } from "./locale-provider";

export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={"loading-block " + className}/>;
}
export function LoadingRegion({ children, label = "Loading the collection…" }: { children: ReactNode; label?: string }) {
  return <div className="loading-region" aria-busy="true"><span className="loading-announcement" role="status"><T text={label}/></span><div aria-hidden="true">{children}</div></div>;
}
export function ProductCardSkeleton() {
  return <div className="card-depth skeleton-stage"><article className="product-card loading-card"><div className="visual-link"><Skeleton className="product-visual"/></div><div className="card-body"><div className="card-meta"><Skeleton className="loading-short"/><Skeleton className="loading-badge"/></div><h3><Skeleton/></h3><p><Skeleton/><Skeleton className="loading-medium"/></p><div className="product-order-status"><Skeleton className="loading-medium"/></div><div className="card-bottom"><Skeleton className="loading-price"/></div><Skeleton className="whatsapp-cta loading-button"/></div></article></div>;
}
export function ProductGridSkeleton({ count = 4, three = false }: { count?: number; three?: boolean }) {
  return <LoadingRegion><div className={"product-grid" + (three ? " three" : "")}>{Array.from({length:count},(_,i)=><ProductCardSkeleton key={i}/>)}</div></LoadingRegion>;
}
export function CatalogSkeleton() {
  return <><div className="catalog-toolbar" aria-hidden="true"><Skeleton className="loading-search"/><Skeleton className="loading-sort"/></div><div className="filters" aria-hidden="true">{[0,1,2,3].map(i=><Skeleton className="loading-chip" key={i}/>)}</div><div className="results-meta" aria-hidden="true"><Skeleton className="loading-short"/></div><ProductGridSkeleton count={8}/></>;
}
export function CategorySkeleton({ page = false }: { page?: boolean }) {
  return <LoadingRegion><div className={"category-grid" + (page ? " category-page" : "")}>{[0,1,2,3].map(i=><div className="category-card" key={i}><Skeleton className="loading-icon"/><Skeleton className="loading-short"/><h3><Skeleton/></h3><p><Skeleton/><Skeleton className="loading-medium"/></p></div>)}</div></LoadingRegion>;
}
export function PanelSkeleton({ label = "Loading your account…" }: { label?: string }) {
  return <LoadingRegion label={label}><div className="panel loading-panel"><Skeleton className="loading-short"/><Skeleton/><Skeleton className="loading-medium"/><Skeleton className="loading-button"/></div></LoadingRegion>;
}
export function CartSkeleton() {
  return <LoadingRegion label="Loading your saved cart…"><div className="cart-layout"><div>{[0,1].map(i=><div className="cart-item" key={i}><Skeleton className="loading-icon"/><div className="loading-panel"><Skeleton/><Skeleton className="loading-medium"/><Skeleton className="loading-price"/></div></div>)}</div><div className="panel loading-panel"><Skeleton/><Skeleton className="loading-medium"/><Skeleton className="loading-button"/></div></div></LoadingRegion>;
}
export function ProductDetailSkeleton() {
  return <div className="container page-space"><LoadingRegion label="Loading product details…"><div className="breadcrumbs"><Skeleton className="loading-short"/></div><div className="product-detail"><Skeleton className="product-visual large"/><div className="product-info loading-panel"><Skeleton className="loading-short"/><h1><Skeleton/></h1><Skeleton/><Skeleton className="loading-medium"/><Skeleton className="loading-price"/><Skeleton className="loading-button"/><Skeleton/><Skeleton/></div></div></LoadingRegion></div>;
}
