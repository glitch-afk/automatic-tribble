import type { ReactNode } from 'react';

type IActionProps = {
  meta: ReactNode;
  children: ReactNode;
};

const ActionLayout = ({ children, meta }: IActionProps) => (
  <div className="min-h-screen w-full bg-white antialiased">
    {meta}
    <div className="container pt-8 text-sm xl:pt-10">
      <div className="xs:p-6 xs:pt-5 mx-auto w-full max-w-lg rounded-lg bg-card p-5 pt-4">
        {children}
      </div>
    </div>
  </div>
);

export { ActionLayout };
