import { twMerge } from 'tailwind-merge';

export type AnswerProps = React.ComponentPropsWithoutRef<'code'> & {
  answer?: string;
};

export function Answer({ className, answer, ...rest }: AnswerProps) {
  if (!answer) {
    return null;
  }

  return (
    <code
      className={twMerge('border rounded bg-neutral-50 p-4', className)}
      {...rest}
    >
      {answer}
    </code>
  );
}
