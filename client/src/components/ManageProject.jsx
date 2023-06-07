import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";

import { CustomButton, Loader,CountBox } from "../components";
import { calculateBarPercentage, daysLeft,calculateProjectState} from "../utils";
import { Icon } from '@iconify/react';

const ManageProject = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {withdrawProjectFunds,withdrawRemainingRewards} = useStateContext();


  
  const remainingDays = daysLeft(state.startDate,state.endDate);
  const [projectState,color] = calculateProjectState(state.startDate,state.endDate,state.target,state.raisedAmount)
  
  const handleClaimButton = async() =>{
    console.log("claim Funds for project")
    setIsLoading(true);
    await withdrawProjectFunds(state.pId);
    setIsLoading(false);
  }

  const handleClaimRemainingRewards = async() =>{
    console.log("claim remaining rewards for project")
    setIsLoading(true);
    await withdrawRemainingRewards(state.pId);
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-col flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">

          <div className="relative w-full mt-2 h-[5px] bg-[#3a3a43]">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex  md:flex-row w-full flex-wrap justify-left gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} color = "white"/>
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected} color = "white"
          />
          <CountBox title="Total Funders" value={state.funders} color = "white" />
          <CountBox title="Project status" value={projectState}  color = {color} />
          <CountBox title = "Reward Token" value = {state.equityToken} color = "white" />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <Icon icon="mdi:account" color="#46d41c" width="24" height="24" />
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className=" font-epilogue font-normal text-[16px] leading-[25px] text-justify text-[#808191] ">
                {state.description}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white  uppercase">
              Funders
            </h4>

            <div className="my-[20px] flex flex-col gap-4">
              {/* {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : ( */}
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]">
                  No donators yet.
                </p>
           
            </div>
          </div>
        </div>
        {projectState == "Finished" && 
          <div className="flex-1">
            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Claim funds
              </p>
              <div className="mt-[30px]">
                <CustomButton
                  btnType="button"
                  title="Claim"
                  styles="w-full bg-[#8c6dfd] mt-4"
                  handleClick = {handleClaimButton}
                />
              </div>
            </div>
          </div>
        }
        {projectState == "Finished" &&          
          <div className="flex-1">
            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Claim rewards
              </p>
              <div className="mt-[30px]">
                <CustomButton
                  btnType="button"
                  title="Claim remaining rewards"
                  styles="w-full bg-[#8c6dfd] mt-4"
                  handleClick = {handleClaimRemainingRewards}
                />
              </div>
            </div>
          </div>}
      </div>
    </div>
  );
};

export default ManageProject;
