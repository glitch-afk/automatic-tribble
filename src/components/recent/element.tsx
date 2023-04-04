import { Check } from "../icons/check";

import { TopRight } from "../icons/TopRight";

const RecentElement = ({
  request
}: {
  request: any
}) => {
  return (
    <li className="cursor-pointer mb-3 w-full">
      <div className="relative w-full rounded-xl bg-white px-2 py-3">
        <div className="w-full flex items-center justify-between space-x-4">
          {/* left side */}
          <div className="w-full flex items-center justify-start space-x-4">
            <div className="flex items-center">
              <Check className="text-green-500 border-2 border-green-500 rounded-full w-8 h-8 p-[2px]" />
            </div>
            {/* right side */}
            <div className="flex flex-col justify-start items-start space-y-1">
              <span className="text-sm font-semibold">{request.receiver.id}</span>
              <span className="text-xs font-semibold text-[#535768]">
                {new Date(request.createdAt).getDate()}/
                {new Date(request.createdAt).getMonth()}/
                {new Date(request.createdAt).getFullYear()}
              </span>
            </div>
          </div>
          <div className="pr-3">
            <TopRight />
          </div>
        </div>
      </div>
    </li>
  );
};

export default RecentElement;
