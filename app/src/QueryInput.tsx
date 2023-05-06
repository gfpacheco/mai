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
      className={twMerge('flex items-end gap-4', className)}
      {...rest}
      onSubmit={handleSubmit}
    >
      <label className="flex-1 flex flex-col gap-2">
        Ask a question:
        <input
          className="border rounded px-4 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <Button type="submit">Ask</Button>
    </form>
  );
}
