import { getPaymentRequest } from "@/lib/hooks/request"
import { useAppContext } from "@/lib/store"
import Link from "next/link"
import { useEffect } from "react"
import RecentElement from "./element"

const explorers: any = {
  '1': 'https://etherscan.io',
  '2': 'https://polygonscan.com',
  '3': 'https://bscscan.io',
  '4': 'https://snowtrace.io',
  '5': 'https://optimistic.etherscan.io',
  '6': 'https://arbiscan.io',
  '7': 'https://solana.fm',
  '8': 'https://aptoscan.com'
}

export const RecentList = () => {
  const { requests, setRequests, identity } = useAppContext()

  useEffect(() => {
    console.log(identity, 'dsa');
    getPaymentRequest({
      payer: `${identity}@${process.env.NEXT_PUBLIC_DEFAULT_PROVIDER}`
    }).then((res) => {
      console.log(res, 'dsa');
      setRequests(res);
    });
  }, [identity]);

  console.log("REQUESRTS => ", requests)
  return (
    <ul className="mx-auto mt-10 max-h-[400px] w-full overflow-y-scroll">
      {requests.length > 0 && requests.map(request => (
        <>
          {request.fromChain && 
            <Link href={`${explorers[request.fromChain.id.toString()]}/tx/${request.transactionHash}`} target={"_blank"}>
              <RecentElement request={request} />
            </Link>
          }
        </>
      ))}
    </ul>
  )
}