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
    value: '/',
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
    <div className="min-h-screen w-full bg-white antialiased">
      {meta}
      <div className="container pt-8 text-sm xl:pt-10">
        <div className="xs:p-6 xs:pt-5 mx-auto w-full max-w-lg rounded-lg bg-card p-5 pt-4">
          {children}
          <div className="mx-auto mt-20 flex w-4/5 items-center justify-between text-gray-600 dark:text-gray-400">
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
