import type { ReactElement } from 'react';

import AuthLayout from '@/layouts/Auth';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

import { RecentList } from '@/components/recent';

const RecentActivity: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold">Recent Activity</h1>
      <div className="w-full mt-8 max-h-[500px] overflow-y-auto">
        <RecentList />
      </div>
    </div>
  );
};

RecentActivity.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout
      meta={
        <Meta
          title="Recent Activity - Fetcch Wallet"
          description="recent activity"
        />
      }
    >
      {page}
    </AuthLayout>
  );
};

export default RecentActivity;
