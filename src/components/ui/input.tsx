"use client";

import * as React from "react";

import { BsEye, BsEyeSlash } from "react-icons/bs";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  divClass?: string;
  inputClass?: string;
  iconClass?: string;
  hasIcon?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ divClass, inputClass, iconClass, hasIcon, type, ...props }, ref) => {
    const [isShowPass, setIsShowPass] = React.useState(false);
    return (
      <div
        className={cn(
          "group h-10 w-full flex justify-between items-center rounded-md border border-input px-3 py-1 shadow-sm transition-colors  group-focus-visible:ring-1 group-focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          divClass
        )}
      >
        <input
          type={!hasIcon ? type : isShowPass ? "text" : type}
          className={cn(
            "flex h-full w-full text-sm bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
            inputClass
          )}
          ref={ref}
          {...props}
        />
        {hasIcon && (
          <div
            className={cn(
              "text-2xl cursor-pointer hover:text-card-foreground",
              iconClass
            )}
          >
            {!isShowPass ? (
              <BsEye
                onClick={() => {
                  setIsShowPass(true);
                }}
              />
            ) : (
              <BsEyeSlash
                onClick={() => {
                  setIsShowPass(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
