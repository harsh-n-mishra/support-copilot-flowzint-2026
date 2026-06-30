type ClassValue = string | number | false | null | undefined | ClassValue[] | Record<string, boolean | null | undefined>;

function clsx(...inputs: ClassValue[]): string {
  return inputs.flatMap((input): string[] => {
    if (!input) return [];
    if (typeof input === "string" || typeof input === "number") return [String(input)];
    if (Array.isArray(input)) return [clsx(...input)];
    return Object.entries(input).filter(([, v]) => Boolean(v)).map(([k]) => k);
  }).filter(Boolean).join(" ");
}

const conflictGroups = [/^(p|px|py|pt|pr|pb|pl)-/, /^(m|mx|my|mt|mr|mb|ml)-/, /^text-/, /^bg-/, /^border-/, /^rounded/, /^shadow/];

function twMerge(className: string): string {
  const tokens = className.trim().split(/\s+/).filter(Boolean);
  const seen = new Map<string, number>();
  tokens.forEach((token, index) => {
    const variant = token.includes(":") ? token.slice(0, token.lastIndexOf(":") + 1) : "";
    const base = token.slice(variant.length);
    const group = conflictGroups.findIndex((rx) => rx.test(base));
    if (group >= 0) seen.set(`${variant}${group}`, index);
  });
  return tokens.filter((token, index) => {
    const variant = token.includes(":") ? token.slice(0, token.lastIndexOf(":") + 1) : "";
    const base = token.slice(variant.length);
    const group = conflictGroups.findIndex((rx) => rx.test(base));
    return group < 0 || seen.get(`${variant}${group}`) === index;
  }).join(" ");
}

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}
