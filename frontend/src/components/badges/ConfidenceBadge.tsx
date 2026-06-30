import { Badge } from "../ui/Badge";export function ConfidenceBadge({value}:{value:number}){return <Badge variant={value>=80?"success":value>=60?"warning":"danger"}>{value}% Confidence</Badge>}
