import { Card, type CardProps } from "./Card";
export function GlassCard(props:CardProps){return <Card variant="glass" {...props} />}
export const GlassCardExample=()=> <GlassCard title="Premium glass">Content</GlassCard>;
