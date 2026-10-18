"use client";
import { T } from "@/components/locale-provider";

export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="container empty-state page-space"><span className="eyebrow"><T text="A SMALL INTERRUPTION"/></span><h1><T text="Something didn’t load."/></h1><p><T text="Please try again to continue exploring the collection."/></p><button className="button primary" onClick={reset}><T text="Try again"/></button></div>; }
