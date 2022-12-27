import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import { Bag } from '@/components/icons/bag';
import { Blocks } from '@/components/icons/block';
import { Bolt } from '@/components/icons/bolt';
import ActiveLink from '@/components/ui/links/active-link';
import { cn } from '@/utils';

interface IAuthLayoutProps {
  meta: ReactNode;
  children: ReactNode;
}

const appMenu = [
  {
    icon: <Bag />,
    value: '/home',
  },
  {
    icon: <Blocks />,
    value: '/',
  },
  {
    icon: <Bolt />,
    value: '/recent',
  },
];

function ActiveNavLink({ href, icon, className }: any) {
  return (
    <ActiveLink
      href={href}
      className={cn(
        'relative z-[1] inline-flex items-center py-1.5 px-3 justify-center',
        className
      )}
      activeClassName="font-medium w-12 h-12 rounded-full bg-white text-white underline"
    >
      {icon}
    </ActiveLink>
  );
}

const AuthLayout = ({ children, meta }: IAuthLayoutProps) => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-indigo-300 antialiased">
      {meta}
      <div className="container text-sm">
        <div className="xs:p-6 relative mx-auto max-h-fit min-h-[600px] w-full max-w-[390px] rounded-lg bg-card p-5">
          {children}
          <div className="absolute inset-x-0 bottom-6 mx-auto flex w-4/5 items-center justify-between">
            {appMenu.map((item, idx) => (
              <ActiveNavLink
                key={idx}
                href={item.value}
                icon={item.icon}
                isActive={item.value === router.pathname}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
