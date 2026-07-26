import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 border border-white/10 shadow-lg",
        glass: "bg-white/5 backdrop-blur-md text-slate-200 hover:text-white hover:bg-white/15 border border-white/10 shadow-md hover:border-white/25",
        cyan: "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/25 border border-cyan-400/30",
        emerald: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 border border-emerald-400/40",
        outline: "border border-white/10 bg-slate-950/60 hover:bg-white/10 text-slate-300 hover:text-white backdrop-blur-md",
        secondary: "bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-700/80",
        ghost: "hover:bg-white/10 text-slate-400 hover:text-white",
        destructive: "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 shadow-md",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-2xl px-6 text-sm",
        icon: "h-9 w-9 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
