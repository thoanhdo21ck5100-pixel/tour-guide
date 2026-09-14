'use client';

import { usePathname } from 'next/navigation';

interface ConditionalRouteWrapperProps {
  children: React.ReactNode;
  hideOnPrefix?: string;
}

export default function ConditionalRouteWrapper({
  children,
  hideOnPrefix = '/admin',
}: ConditionalRouteWrapperProps) {
  const pathname = usePathname();

  if (pathname?.startsWith(hideOnPrefix)) {
    return null;
  }

  return <>{children}</>;
}
