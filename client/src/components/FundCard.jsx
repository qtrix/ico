import React from "react";
import { daysLeft } from "../utils";
import { Icon } from '@iconify/react';
import {calculateProjectState} from "../utils";
const FundCard = ({
  owner,
  title,
  description,
  target,
  startDate,
  endDate,
  amountCollected,
  rewards,
  equityToken,
  handleClick,
}) => {
  const remainingDays = daysLeft(startDate,endDate);
  const [projectState,color] = calculateProjectState(startDate,endDate,target,amountCollected)
  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer "
      onClick={handleClick}
    >

      <div className="flex flex-col p-4">
        <div className="block">
          <h3 className="text-white  font-semibold text-left leading-[26px] truncate">
            {title}
          </h3>

          <p className="mt-[5px] font-epilogue font-normal text-left leading-[18px] truncate text-[#808191]">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="font-epilogue font-normal mt-[3px] text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate ">
              Raised of {target}
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {remainingDays}
            </h4>
            <p className="font-epilogue font-normal mt-[3px] text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate ">
              Days Left
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {rewards}
            </h4>
            <p className="font-epilogue font-normal mt-[3px] text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate ">
              Rewards
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
          <Icon icon="mdi:account" color="#46d41c" width="14" height="14" />
            
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            by <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
          <Icon icon="material-symbols:attach-money-rounded" color="#46d41c" width="14" height="14" />
            
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
             <span className={`text-white`}>{equityToken}</span>
          </p>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
          <Icon icon="ic:outline-watch-later" color="#46d41c" width="14" height="14" />
            
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
             <span className={`text-${color}`}>{projectState}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
