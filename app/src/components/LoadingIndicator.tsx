import { twMerge } from 'tailwind-merge';

export type LoadingIndicatorProps = React.ComponentPropsWithoutRef<'div'>;

export function LoadingIndicator({
  className,
  ...rest
}: LoadingIndicatorProps) {
  return (
    <div
      className={twMerge(
        'inline-block w-4 h-4 border-2 rounded-full border-current border-t-transparent animate-spin',
        className,
      )}
      {...rest}
    />
  );
}
