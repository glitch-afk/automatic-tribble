import type { SVGProps } from 'react';

export function Loading(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" {...props}>
      <path fill="black" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z" />
    </svg>
  );
}
