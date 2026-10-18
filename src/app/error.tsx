"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="container empty-state page-space"><span className="eyebrow">A SMALL INTERRUPTION</span><h1>Something didn’t load.</h1><p>Please try again to continue exploring the collection.</p><button className="button primary" onClick={reset}>Try again</button></div>; }
