import React from 'react';

interface INotificationItemProps {
  amount: string; // change the type as per api requirement
  requestedBy: string;
}

const NotificationItem = ({ amount, requestedBy }: INotificationItemProps) => {
  return (
    <li className="flex w-full flex-col space-y-2 rounded-xl bg-white p-2">
      {/* amount */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-500">Amount</h3>
        <span className="text-sm font-semibold">{amount}</span>
      </div>
      {/* requested by */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-500">Requested by</h3>
        <span className="text-sm font-semibold">{requestedBy}</span>
      </div>
      <div className="flex w-full items-center space-x-2">
        <button className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white">
          Pay
        </button>
        <button className="w-full rounded-xl border border-neutral-400 py-3 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </li>
  );
};

export default NotificationItem;
