import { twMerge } from 'tailwind-merge';

export type ErrorsProps = React.ComponentPropsWithoutRef<'ul'> & {
  errors: (Error | null)[];
};

export function Errors({ className, errors, ...rest }: ErrorsProps) {
  const filteredErrors = errors.filter(Boolean) as Error[];

  if (filteredErrors.length === 0) {
    return null;
  }

  return (
    <ul
      className={twMerge(
        'border-2 border-dashed border-red-200 rounded bg-red-50 p-4 list-disc list-inside',
        className,
      )}
      {...rest}
    >
      {filteredErrors.map((error, i) => (
        <li key={i}>{error.toString()}</li>
      ))}
    </ul>
  );
}
