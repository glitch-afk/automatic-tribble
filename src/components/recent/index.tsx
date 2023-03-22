import { useAppContext } from "@/lib/store"
import Link from "next/link"
import RecentElement from "./element"

export const RecentList = () => {
  const { requests } = useAppContext()
  
  return (
    <ul className="mx-auto mt-10 max-h-[400px] w-full overflow-y-scroll">
      {requests.length > 0 && requests.map(request => (
        <>
          {request.fromChain && 
            <Link href={`${request.fromChain.explorers[0].url}/tx/${request.transactionHash}`} target={"_blank"}>
              <RecentElement request={request} />
            </Link>
          }
        </>
      ))}
    </ul>
  )
}