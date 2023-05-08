import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from './Button';

export type QueryInputProps = Omit<
  React.ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> & {
  onSubmit(query: string): void;
};

export function QueryInput({ className, onSubmit, ...rest }: QueryInputProps) {
  const [query, setQuery] = useState(
    'what should i do to request an it service',
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (query) {
      onSubmit(query);
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <Button className="rounded-tl-none rounded-bl-none" type="submit">
        Ask
      </Button>
    </form>
  );
}
