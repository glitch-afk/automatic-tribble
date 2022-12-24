import Link from 'next/link';
import type { ReactElement } from 'react';
import React from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import { Wait } from '@/components/icons/wait';
import NotificationItem from '@/components/ui/notification-item';
import { ActionLayout } from '@/layouts/Action';
import { NotificationsData } from '@/lib/data/mockData';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';

const NotificationsPage: NextPageWithLayout = () => {
  return (
    <div>
      <header className="flex w-full items-center">
        {/* back button */}
        <Link href="/home" className="z-20">
          <LeftIcon className="z-10 h-6 w-6" />
        </Link>
        <Link href="/home"></Link>
        <h2 className="-ml-6 w-full text-center text-xl font-semibold">
          Notifications
        </h2>
      </header>
      {/* notification list */}
      <div className="mt-8 max-h-[500px] overflow-y-auto">
        <ul className=" flex w-full flex-col items-center justify-center space-y-3 rounded-xl">
          {NotificationsData.length > 0 ? (
            NotificationsData.map((notification, index) => (
              <NotificationItem
                amount={notification.amount}
                key={index}
                requestedBy={notification.requestedBy}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-fit rounded-md bg-slate-500 py-3 px-4">
                <Wait />
              </div>
              <span>No Transaction Notifications</span>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

NotificationsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ActionLayout
      meta={
        <Meta
          title="Notifications - Fetcch Wallet"
          description="Notifications"
        />
      }
    >
      {page}
    </ActionLayout>
  );
};

export default NotificationsPage;
