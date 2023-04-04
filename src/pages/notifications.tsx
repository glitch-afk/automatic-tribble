import Link from 'next/link';
import { ReactElement, useEffect } from 'react';

import { LeftIcon } from '@/components/icons/leftIcon';
import { Wait } from '@/components/icons/wait';
import NotificationItem from '@/components/ui/notification-item';
import { ActionLayout } from '@/layouts/Action';
import { Meta } from '@/lib/Meta';
import type { NextPageWithLayout } from '@/types';
import { useAppContext } from '@/lib/store';
import { getPaymentRequest, getTokenDetail } from '@/lib/hooks/request';
import { getToken } from 'fetcch-chain-data';
import { Balance } from '@/lib/hooks/useBalances';

const NotificationsPage: NextPageWithLayout = () => {
  const { requests, idData, setRequests } = useAppContext()  

  useEffect(() => {    
    getPaymentRequest({
      payer: idData?.id
    }).then(async (res) => {
      let responses = []
      
      for(let i = 0; i < res.length; i++) {
        const r = res[i]
        
        if(r.chain.id === 8 || r.chain.id === 7) {
          const detail = await getTokenDetail(r.token, r.chain.id)
          r.token = detail
        } else {
          const detail = getToken(r.token, r.chain.id)
          
          r.token = {
            tokenAddress: detail.address,
            chain: detail.chainId,
            tokenDecimal: detail.decimals,
            tokenName: detail.name,
            tokenTicker: detail.symbol,
            tokenLogo: detail.logoURI
          } as Partial<Balance>;
        }

        responses.push(r)
      }

      console.log(responses)
      
      setRequests(responses);
    });
  }, []);

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
          {requests.length > 0 ? (
            requests.map((notification: any, index) => {
              if(notification.executed) return <></>
              else return (
                <NotificationItem
                  request={notification}
                  address={notification.token}
                  chain={notification.chain.chainId}
                  amount={notification.amount}
                  key={index}
                  requestedBy={notification.receiver.id}
                />
              )
            })
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
