'use client';

import type { ErrorComponent } from 'next/dist/client/components/error-boundary';

const Error: ErrorComponent = ({ error, reset }) => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-white md:text-3xl">
        Something went wrong!
      </h2>
      <p className="my-10 px-4 text-center text-base font-medium text-white md:text-lg">
        {error.message}
      </p>
      <button
        className="bg-primary flex h-10 cursor-pointer items-center justify-center rounded-full px-5 text-base font-normal text-white"
        aria-label="retry"
        onClick={reset}>
        Try again
      </button>
    </section>
  );
};

export default Error;
