import { twMerge } from 'tailwind-merge';

export type ButtonProps = React.ComponentPropsWithoutRef<'button'>;

export function Button({ className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge('h-10 bg-blue-500 text-white rounded px-4', className)}
      {...rest}
    />
  );
}
