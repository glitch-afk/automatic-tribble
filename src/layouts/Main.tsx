import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = ({ children, meta }: IMainProps) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white antialiased">
    {meta}
    <div className="container pt-8 text-sm xl:pt-10">
      <div className="xs:p-6 xs:pt-5 mx-auto w-full max-w-[390px] h-[844px] rounded-lg bg-card p-5 pt-4">
        {children}
      </div>
    </div>
  </div>
);

export { Main };
