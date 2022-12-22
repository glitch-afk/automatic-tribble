import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full antialiased">
    {props.meta}

    <div className="container mx-auto max-w-3xl">
      <div>{props.children}</div>
    </div>
  </div>
);

export { Main };
