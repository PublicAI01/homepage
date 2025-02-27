'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import VerifyDialog from '@/app/official-verification/verify-dialog';
import ExtendUp from '@/assets/svg/extend-up.svg?react';
import Search from '@/assets/svg/search.svg?react';
import { cn } from '@/utils';

const QUERY_TYPE_LIST = [
  { label: 'Email', value: 0 },
  { label: 'X(Twitter)', value: 1 },
  { label: 'Telegram', value: 2 },
] as const;
type QueryType = (typeof QUERY_TYPE_LIST)[number]['value'];
const QUERY_TYPE_MAP = QUERY_TYPE_LIST.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  },
  {} as Record<QueryType, string>,
);

export interface VerifyActionState {
  type: string;
  query: string;
  result: boolean;
}

const sleep = async (ms: number | undefined = 3000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface VerifyFormProps extends React.ComponentProps<'form'> {}

const VerifyForm = (props: VerifyFormProps) => {
  const { className, ...rest } = props;

  const [type, setType] = useState<QueryType>(QUERY_TYPE_LIST[0].value);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<VerifyActionState | undefined>(
    async () => {
      if (!query) return;
      await sleep(5000);
      const response = await fetch(
        `${process.env.NEXT_BASE_URL}/api/common/verify`,
        {
          method: 'POST',
          body: JSON.stringify({ type, name: query }),
        },
      );
      if (response.ok) {
        const result = (await response.json()) as {
          code?: number;
          data?: { result: boolean };
          msg?: string;
        };
        setOpen(true);
        return {
          type: QUERY_TYPE_MAP[type],
          query,
          result: result.data?.result ?? false,
        };
      }
    },
    { type: QUERY_TYPE_LIST[0].label, query: '', result: false },
  );

  return (
    <>
      <form
        className={cn(
          'mx-auto flex flex-col items-center gap-3.5 max-sm:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))] lg:w-4/5 lg:flex-row lg:gap-15',
          className,
        )}
        {...rest}
        action={formAction}>
        <div className="lg:app-shadow flex w-full flex-1 flex-col items-center gap-2 border-white bg-black/50 lg:flex-row lg:rounded-xl lg:border lg:p-2">
          <Listbox
            value={type}
            onChange={setType}>
            <div className="relative max-lg:w-full">
              <ListboxButton className="bg-primary flex cursor-pointer items-center gap-2 rounded-sm p-2 text-left text-white max-lg:w-full">
                <span className="block min-w-25 text-base max-lg:flex-1 lg:text-xl">
                  {QUERY_TYPE_MAP[type]}
                </span>
                <ExtendUp
                  aria-hidden="true"
                  className="h-auto w-4 rotate-180 text-white"
                />
              </ListboxButton>

              <ListboxOptions
                transition
                className="absolute z-10 max-h-56 w-full overflow-auto rounded-md bg-[#0E100C] text-base shadow-lg ring-1 ring-[#B9B9B9] focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm lg:mt-5">
                {QUERY_TYPE_LIST.map((type) => (
                  <ListboxOption
                    key={type.value}
                    value={type.value}
                    className="group relative cursor-pointer py-2 pr-9 pl-3 text-white select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden">
                    <span className="block truncate text-sm font-normal group-data-selected:font-semibold lg:text-lg">
                      {type.label}
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          <div className="max-lg:app-shadow flex w-full items-center gap-1.5 rounded-sm border-white max-lg:border max-lg:p-1.5 lg:gap-2">
            <Search className="h-auto w-5 text-[#B9B9B9] lg:w-8" />
            <input
              className="flex-1 appearance-none text-lg text-white outline-hidden lg:text-2xl"
              type="text"
              placeholder="Enter query"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>
        </div>
        <SubmitButton />
      </form>
      <VerifyDialog
        isOpen={open}
        setIsOpen={setOpen}
        state={state}
      />
    </>
  );
};

interface SubmitButtonProps
  extends Omit<
    React.ComponentProps<'button'>,
    'type' | 'aria-label' | 'disabled'
  > {}

const SubmitButton = (props: SubmitButtonProps) => {
  const { className, ...rest } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        'bg-primary app-shadow min-w-60 self-stretch rounded-sm py-2 text-center text-base font-medium text-white shadow-white max-lg:w-full lg:rounded-xl lg:text-xl',
        pending ? 'opacity-75' : 'cursor-pointer',
        className,
      )}
      type="submit"
      aria-label="to data hub website"
      disabled={pending}
      {...rest}>
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="size-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading
        </span>
      ) : (
        'Search'
      )}
    </button>
  );
};

export default VerifyForm;
