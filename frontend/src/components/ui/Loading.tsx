import { cn } from "../../utils/cn";
export type LoadingSize = "sm"|"md"|"lg";
const sizeMap={sm:"h-4 w-4",md:"h-6 w-6",lg:"h-10 w-10"};
export function Spinner({size="md",className}:{size?:LoadingSize;className?:string}){return <span role="status" aria-label="Loading" className={cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent",sizeMap[size],className)} />}
export function Pulse({className}:{className?:string}){return <span role="status" aria-label="Loading" className={cn("inline-block h-3 w-3 animate-pulse rounded-full bg-[var(--color-primary)]",className)} />}
export function Dots({className}:{className?:string}){return <span role="status" aria-label="Loading" className={cn("inline-flex gap-1",className)}>{[0,1,2].map(i=><span key={i} className="h-2 w-2 animate-bounce rounded-full bg-current" style={{animationDelay:`${i*120}ms`}} />)}</span>}
export function Loading(){return <Spinner />}
export const LoadingExample=()=> <div className="flex gap-3"><Spinner/><Pulse/><Dots/></div>;
