import type { ReactElement } from 'react';

import AuthLayout from '@/layouts/Auth';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const RecentActivity: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold">Recent Activity</h1>
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
