import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button, ButtonProps } from './Button';

export type QuestionInputProps = Omit<
  React.ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> & {
  onSubmit(question: string): void;
  loading: ButtonProps['loading'];
};

export function QuestionInput({
  className,
  onSubmit,
  loading,
  ...rest
}: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (question) {
      onSubmit(question);
      setQuestion('');
    }
  }

  return (
    <form
      className={twMerge('flex items-end', className)}
      {...rest}
      onSubmit={handleSubmit}
    >
      <label className="flex-1 flex flex-col gap-2">
        <span className="font-bold">Ask a question:</span>
        <input
          className="h-10 border border-r-0 rounded-tl rounded-bl px-4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </label>
      <Button
        className="rounded-tl-none rounded-bl-none"
        type="submit"
        loading={loading}
      >
        Ask
      </Button>
    </form>
  );
}
