'use client';

import { usePathname } from 'next/navigation';

/**
 * Renders nothing on the routes named. The site's floating social rail and
 * the footer's "Stay Connected" row stand aside on the Index, which carries
 * its own "Follow" row under the introduction.
 */
export default function HideOn({
  prefixes,
  children,
}: {
  prefixes: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return null;
  return <>{children}</>;
}
