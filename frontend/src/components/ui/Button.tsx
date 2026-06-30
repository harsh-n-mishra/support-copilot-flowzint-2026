import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Loading";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; iconOnly?: boolean; fullWidth?: boolean;
}
const variants: Record<ButtonVariant,string> = {
  primary:"bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)] hover:bg-[var(--color-primary-strong)]",
  secondary:"bg-white/10 text-[var(--color-text)] hover:bg-white/15 border border-[var(--color-border)]",
  outline:"border border-[var(--color-border-strong)] text-[var(--color-text)] hover:bg-white/10",
  ghost:"text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]",
  destructive:"bg-[var(--color-danger)] text-white hover:brightness-110",
  success:"bg-[var(--color-success)] text-white hover:brightness-110",
};
const sizes: Record<ButtonSize,string> = { xs:"h-7 px-2 text-xs", sm:"h-8 px-3 text-sm", md:"h-10 px-4 text-sm", lg:"h-12 px-5 text-base" };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({className,variant="primary",size="md",loading,leftIcon,rightIcon,iconOnly,fullWidth,disabled,children,type="button",...props},ref)=> (
  <button ref={ref} type={type} disabled={disabled||loading} aria-busy={loading} className={cn("inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50", variants[variant], sizes[size], iconOnly && "aspect-square px-0", fullWidth && "w-full", className)} {...props}>
    {loading ? <Spinner size="sm" /> : leftIcon}{!iconOnly && children}{rightIcon && !loading ? rightIcon : null}
  </button>
));
Button.displayName="Button";
export const ButtonExample = () => <Button variant="primary" size="md" loading>Save</Button>;
