import { Loader2 } from "lucide-react";
import React from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "../ui/button";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading: boolean;
  children: React.ReactNode;
}

export const LoadingBtn = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, children, variant = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || props.disabled}
        className="cursor-pointer"
        variant={variant}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          children
        )}
      </Button>
    );
  }
);
