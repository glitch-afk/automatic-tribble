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
import { createAuthToken } from '@/lib/hooks/authToken';

const NotificationsPage: NextPageWithLayout = () => {
  const { requests, idData, setRequests, authToken, setAccessToken, addresses } = useAppContext()  

  useEffect(() => console.log(requests, "dsads"), [requests])
  useEffect(() => {    
    getPaymentRequest({
      payer: idData?.id,
    }, authToken).then(async (res) => {
      
      let responses = []
      for(let i = 0; i < res.length; i++) {
        const r = res[i]
        console.log(r, "dsadsads")
        if(r.chainId === 8 || r.chainId === 7) {
          const detail = await getTokenDetail(r.token, r.chainId)
          r.token = detail
        } else {
          const detail = getToken(r.token, r.chainId)
          
          r.token = {
            tokenAddress: detail.address,
            chain: detail.chainId,
            tokenDecimal: detail.decimals,
            tokenName: detail.name,
            tokenTicker: detail.symbol,
            tokenLogo: detail.logoURI
          } as Partial<Balance>;
        }

        console.log(r.token)
        responses.push(r)
      }

      console.log(responses)
      
      setRequests(responses);
    }).catch(async e => {
      const address = addresses.find(x => x.address.toLowerCase() === idData?.default.address.toLowerCase())
        if(!address) return
        const accessToken = await createAuthToken(address.privateKey!, address.chain == 7 ? "SOLANA" : "EVM", idData!.id!)
    
        setAccessToken(accessToken)
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
                  chain={notification.chainId}
                  amount={notification.amount}
                  key={index}
                  requestedBy={notification.recevier.ownerId ?? notification.recevier.owner}
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
