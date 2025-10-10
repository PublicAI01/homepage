'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { useActionState, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';

import ExtendUp from '@/assets/svg/extend-up.svg?react';
import Search from '@/assets/svg/search.svg?react';
import Modal from '@/components/Modal';
import { cn } from '@/utils';

const QUERY_TYPE_LIST = [
  { label: 'Telegram', value: 2 },
  { label: 'X(Twitter)', value: 1 },
  { label: 'Email', value: 0 },
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
  query: string;
  result: boolean;
}

interface VerifyFormProps extends React.ComponentProps<'form'> {}

const VerifyForm = (props: VerifyFormProps) => {
  const { className, ...rest } = props;

  const [type, setType] = useState<QueryType>(QUERY_TYPE_LIST[0].value);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [state, formAction] = useActionState<VerifyActionState | undefined>(
    async () => {
      if (!query) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/common/verify`,
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
        setVisible(true);
        return {
          query,
          result: result.data?.result ?? false,
        };
      }
    },
    { query: '', result: false },
  );
  const [isVerified, label] = useMemo(
    () => [state?.result ?? false, QUERY_TYPE_MAP[type]],
    [state?.result, type],
  );

  return (
    <search>
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
      <Modal
        className={
          isVerified
            ? ''
            : "[background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjRkIyQzM2IiBmaWxsLW9wYWNpdHk9Ii4yIiBkPSJNMTguMTQ4Mzk4MiwxNS45OTExNDUyIEwyNS41NTYxOTgsOC41ODM5NTA3OCBDMjYuMTQ3MTI2Nyw3Ljk5MzAyMjA4IDI2LjE0NzEyNjcsNy4wMzQ1NzkzMiAyNS41NTYxOTgsNi40NDM2NTA2MiBDMjQuOTY0NjYzOSw1Ljg1MjExNjQ2IDI0LjAwNjgyNjYsNS44NTIxMTY0NiAyMy40MTU4OTc5LDYuNDQzNjUwNjIgTDE2LjAwODA5OCwxMy44NTA4NDUgTDguNjAwOTAzNjUsNi40NDM2NTA2MiBDOC4wMDk5NzQ5NSw1Ljg1MjExNjQ2IDcuMDUwOTI2NzMsNS44NTIxMTY0NiA2LjQ2MDYwMzQ5LDYuNDQzNjUwNjIgQzUuODY5MDY5MzMsNy4wMzQ1NzkzMiA1Ljg2OTA2OTMzLDcuOTkzMDIyMDggNi40NjA2MDM0OSw4LjU4Mzk1MDc4IEwxMy44Njc3OTc5LDE1Ljk5MTE0NTIgTDYuNDQzNjUwNjIsMjMuNDE1ODk3OSBDNS44NTIxMTY0NiwyNC4wMDc0MzIgNS44NTIxMTY0NiwyNC45NjUyNjkzIDYuNDQzNjUwNjIsMjUuNTU2MTk4IEM2LjczOTExNDk3LDI1Ljg1MTY2MjQgNy4xMjY2MDkyLDI1Ljk5OTM5NDUgNy41MTQxMDM0MywyNS45OTkzOTQ1IEM3LjkwMTU5NzY2LDI1Ljk5OTM5NDUgOC4yODkwOTE4OSwyNS44NTE2NjI0IDguNTg0NTU2MjQsMjUuNTU2MTk4IEwxNi4wMDg3MDM1LDE4LjEzMTQ0NTMgTDIzLjQxNTg5NzksMjUuNTM4NjM5NyBDMjMuNzExMzYyMiwyNS44MzQxMDQgMjQuMDk4ODU2NCwyNS45ODE4MzYyIDI0LjQ4NjM1MDcsMjUuOTgxODM2MiBDMjQuODczODQ0OSwyNS45ODE4MzYyIDI1LjI2MDczMzcsMjUuODM0MTA0IDI1LjU1NjgwMzUsMjUuNTM4NjM5NyBDMjYuMTQ3NzMyMiwyNC45NDcxMDU1IDI2LjE0NzczMjIsMjMuOTg5MjY4MiAyNS41NTY4MDM1LDIzLjM5ODMzOTUiLz48L3N2Zz4=')]"
        }
        bodyClassName="prose prose-sm prose-invert text-center"
        visible={visible}
        close={() => {
          setVisible(false);
        }}>
        <h2>{isVerified ? `Verified ${label}` : `Unverified ${label}`}</h2>
        <strong className="text-p1">{state?.query ?? '--'}</strong>
        <h3
          className={cn(
            'mt-[0.8em] text-center text-lg',
            isVerified ? 'text-green-500' : 'text-red-500',
          )}>
          {isVerified ? 'Verified Successfully✅' : 'Verified failed🚫'}
        </h3>
        <p>
          {isVerified
            ? `The source you entered is an official ${label} from PublicAI`
            : `The source you entered is not an official ${label} from PublicAI. Please check that you have chosen the correct query type, as incorrect tags will affect verification results.`}
        </p>
        <button
          className="bg-primary w-full cursor-pointer rounded-sm px-6 py-3 text-base text-white"
          aria-label="Confirmation of query result"
          onClick={() => {
            setVisible(false);
          }}>
          Ok
        </button>
      </Modal>
    </search>
  );
};

type SubmitButtonProps = Omit<
  React.ComponentProps<'button'>,
  'type' | 'aria-label' | 'disabled'
>;

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
      aria-label="Submit query request"
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
