import { ethers } from 'ethers';
import Link from 'next/link';

interface INotificationItemProps {
  amount: string; // change the type as per api requirement
  address: string;
  chain: string;
  requestedBy: string;
  request: any;
}

const NotificationItem = ({ request, amount, requestedBy }: INotificationItemProps) => {
  return (
    <li className="flex w-full flex-col space-y-2 rounded-xl bg-white p-2">
      {/* amount */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-500">Amount</h3>
        {request.token && request.token.tokenTicker && request.token.tokenDecimal && (
          <span className="text-sm font-semibold">
            {ethers.utils.formatUnits(amount, request.token.tokenDecimal)}{" "}
            {request.token.tokenTicker}
          </span>
        )}
      </div>
      {/* requested by */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-500">Requested by</h3>
        <span className="text-sm font-semibold">{requestedBy}</span>
      </div>
      <div className="flex w-full items-center space-x-2">
        <Link
          href={`/send?request=${JSON.stringify(
            request
          )}&token=${JSON.stringify(request.token)}`}
          className="w-full rounded-xl bg-black text-center py-3 text-sm font-semibold text-white"
        >
          Pay
        </Link>
        <button className="w-full rounded-xl border border-neutral-400 py-3 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </li>
  );
};

export default NotificationItem;
