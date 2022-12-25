import type { ReactNode } from 'react';

interface ICreateWalletLayoutProps {
  meta: ReactNode;
  children: ReactNode;
}

const CreateWalletLayout = ({ children, meta }: ICreateWalletLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-indigo-300 antialiased">
      {meta}
      <div className="container text-sm">
        <div className="xs:p-6 relative mx-auto max-h-fit min-h-[600px] w-full max-w-[390px] rounded-lg bg-card p-5">
          <h1 className="text-center text-lg font-bold">Create Wallet</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CreateWalletLayout;
