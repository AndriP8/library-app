import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showPassword?: boolean;
  setShowPassword?: (value: boolean) => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, showPassword = true, setShowPassword, ...props },
    ref,
  ) => {
    return (
      <div className="relative">
        <input
          type={showPassword ? type : 'password'}
          className={cn(
            'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {setShowPassword ? (
          <>
            <EyeIcon
              onClick={() => setShowPassword(false)}
              visibility={showPassword ? 'show' : 'hidden'}
              className="absolute inset-y-0 right-0 mr-3 size-5 h-full cursor-pointer items-center"
            />
            <EyeOffIcon
              onClick={() => setShowPassword(true)}
              visibility={!showPassword ? 'show' : 'hidden'}
              className="absolute inset-y-0 right-0 mr-3 size-5 h-full cursor-pointer items-center"
            />
          </>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
