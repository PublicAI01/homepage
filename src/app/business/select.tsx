'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { useMemo, useState } from 'react';

import { cn } from '@/utils';

export interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  /** Classes for the trigger, shared with the form's text fields. */
  className?: string;
  searchable?: boolean;
  placeholder?: string;
}

const optionsClassName = cn(
  'rounded-10 z-10 max-h-56 overflow-auto border border-[#2C2C31] bg-[#0E100C] p-1 shadow-lg [--anchor-gap:0.375rem]',
  'transition duration-100 ease-in data-closed:opacity-0',
);

const optionClassName = cn(
  'cursor-pointer rounded-md px-3 py-2 text-sm text-white select-none',
  'data-focus:bg-primary data-selected:font-semibold',
);

const Chevron = () => (
  <span
    className="border-g2 pointer-events-none size-2 shrink-0 -translate-y-1/4 rotate-45 border-r-2 border-b-2"
    aria-hidden="true"
  />
);

const SearchableSelect = (props: SelectProps) => {
  const { id, value, onChange, options, className, placeholder } = props;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => option.toLowerCase().includes(needle));
  }, [options, query]);

  return (
    <Combobox
      value={value}
      onChange={(next) => {
        onChange(next ?? '');
      }}
      onClose={() => {
        setQuery('');
      }}>
      <div className="relative">
        <ComboboxInput
          className={cn(className, 'pr-9')}
          id={id}
          displayValue={(current: string) => current}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3.5">
          <Chevron />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        transition
        anchor="bottom start"
        className={cn(optionsClassName, 'w-(--input-width)')}>
        {filtered.length === 0 ? (
          <div className="px-3 py-2 text-sm text-[#6F6F78]">
            No results found
          </div>
        ) : (
          filtered.map((option) => (
            <ComboboxOption
              key={option}
              className={optionClassName}
              value={option}>
              {option}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  );
};

const Select = (props: SelectProps) => {
  const {
    id,
    value,
    onChange,
    options,
    className,
    searchable = false,
    placeholder = 'Please select',
  } = props;

  if (searchable) {
    return (
      <SearchableSelect
        {...props}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Listbox
      value={value}
      onChange={onChange}>
      <ListboxButton
        className={cn(
          className,
          'flex cursor-pointer items-center justify-between gap-2 text-left',
          value ? 'text-white' : 'text-[#6F6F78]',
        )}
        id={id}>
        <span className="truncate">{value || placeholder}</span>
        <Chevron />
      </ListboxButton>
      <ListboxOptions
        transition
        anchor="bottom start"
        className={cn(optionsClassName, 'w-(--button-width)')}>
        {options.map((option) => (
          <ListboxOption
            key={option}
            className={optionClassName}
            value={option}>
            {option}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export default Select;
