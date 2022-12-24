import type { ReactNode } from 'react';

type IActionProps = {
  meta: ReactNode;
  children: ReactNode;
};

const ActionLayout = ({ children, meta }: IActionProps) => (
  <div className="flex min-h-screen w-full items-center justify-center bg-indigo-300 antialiased">
    {meta}
    <div className="container pt-8 text-sm xl:pt-10">
      <div className="xs:p-6 mx-auto min-h-fit w-full max-w-[390px] rounded-lg bg-card p-5">
        {children}
      </div>
    </div>
  </div>
);

export { ActionLayout };
