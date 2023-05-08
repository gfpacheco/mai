import { twMerge } from 'tailwind-merge';

import { LoadingIndicator } from './LoadingIndicator';

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  loading?: boolean;
};

export function Button({
  className,
  loading,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        'relative h-10 bg-blue-500 text-white rounded px-4 disabled:opacity-50',
        loading && 'text-transparent',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex text-white">
          <LoadingIndicator />
        </div>
      )}
    </button>
  );
}
