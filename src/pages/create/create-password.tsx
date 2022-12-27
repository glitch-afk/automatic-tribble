import Link from 'next/link';
import { ReactElement } from 'react';

import CreateWalletLayout from '@/layouts/create';
import { Meta } from '@/lib/Meta';

// use loading screen from components if needed
const CreatePassword = () => {
  // const { identity, addresses, chains } = useAppContext()
  
  return (
    <div className="mt-12 flex w-full flex-col space-y-2">
      <h2 className="text-xl font-semibold">Create a Password</h2>
      <p className="w-2/3 text-xs text-neutral-500">
        It should be atleast 8 characters. You’ll need this to unlock Backpack.
      </p>
      <div className="flex flex-col items-center justify-center space-y-3">
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter Password"
          className="w-full rounded-xl border-none bg-white py-3 px-2 text-sm outline-none placeholder:text-neutral-400"
        />
        {/* confirm password */}
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Confirm Password"
          className="w-full rounded-xl border-none bg-white py-3 px-2 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      {/* Next button */}
      <div className="container absolute inset-x-0 bottom-4 w-full">
        <div className="flex w-full">
          <Link
            href="/home"
            className="w-full rounded-xl bg-black py-3 text-center text-sm text-white"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

CreatePassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <CreateWalletLayout
      meta={
        <Meta
          title="Create Password - FetcchX"
          description="create a secure password"
        />
      }
    >
      {page}
    </CreateWalletLayout>
  );
};

export default CreatePassword;
