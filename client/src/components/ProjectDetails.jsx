import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import Alert from '@mui/material/Alert';
import { CustomButton, Loader,CountBox } from "../components";
import { calculateBarPercentage, daysLeft,calculateProjectState, calcultateUserRewards, hoursLeft} from "../utils";
import { Icon } from '@iconify/react';

const ProjectDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userFunds, setUserFunds] = useState(0);
  const [userClaimed,setUserClaimed] = useState(false);
  const {getUserProjectFunds,fundProject,withdrawFunds, claimReward,checkUserClaimed, address} = useStateContext();

  const getUserFunds  = async () => {
    const data = await getUserProjectFunds(state.pId);
    console.log(data)
    setUserFunds(data);
  }
  console.log(state.pId)
  useEffect(() => {
       getUserFunds();
       return () => {
        console.log('This will be logged on unmount');
      };
    },);
  
  console.log("userFunds" + userFunds)
  const remainingDays = daysLeft(state.startDate,state.endDate);
  const remainingHours = hoursLeft(state.startDate, state.endDate);
  const [projectState,color] = calculateProjectState(state.startDate,state.endDate,state.target,state.raisedAmount)
  const userReward = calcultateUserRewards(userFunds,state.target,state.amountCollected,state.rewards)
  
  console.log("user rewards : " + userReward)
  const handleFundButton = async() =>{
    console.log("fund project")
    setIsLoading(true);
    await fundProject(state.pId,fundAmount);
    setUserFunds(userFunds + fundAmount);
    setIsLoading(false);
    navigate("/ico")
  }

  const handleWithdrawButton = async() =>{
    setIsLoading(true);
    await withdrawFunds(state.pId,withdrawAmount);
    setUserFunds(userFunds - withdrawAmount);
    setIsLoading(false);
    navigate("/ico")
  }

  const handleClaimButton = async () => {
    let claimed = await checkUserClaimed(state.pId)
    if(claimed){
      setUserClaimed(claimed)
      return;
    }
    
    setIsLoading(true);
    await claimReward(state.pId);
    setIsLoading(false);
    navigate("/ico")
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
          {remainingDays > 0 && <CountBox title="Days Left" value={remainingDays} color = "white"/>}
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected} color = "white"
          />
          <CountBox title="Total Funders" value={state.funders} color = "white" />
          <CountBox title="Project status" value={projectState}  color = {color} />
          <CountBox title="Your funds" value={userFunds > 0 ? userFunds : 0}  color = "white"/>
          <CountBox title="Your rewards" value={userReward}  color = "white"/>
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
                  No donators yet. Be the First one!
                </p>
           
            </div>
          </div>
        </div>
        {projectState == "In progress" && address &&
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Fund
            </h4>
            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Fund the Project
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="USDC 1"
                  step="0.01"
                />

                <CustomButton
                  btnType="button"
                  title="Fund Project"
                  styles="w-full bg-[#8c6dfd] mt-4"
                  handleClick = {handleFundButton}
                />
              </div>
            </div>
          </div>
        }
        {userFunds > 0 && projectState == "In progress" &&  
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Whitdraw your funds
            </h4>
            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Whitdraw your funds
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="USDC 1"
                  step="0.01"
                />

                <CustomButton
                  btnType="button"
                  title="Withdraw Funds"
                  styles="w-full bg-[#8c6dfd] mt-4"
                  handleClick = {handleWithdrawButton}
                />
              </div>
            </div>
          </div> 
        }
        { userReward > 0 && projectState == "Finished" && 
        <div className="flex-1">
            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
            Claim your reward
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
      </div>
      {userClaimed && (
                       <Alert  variant="filled" severity="success" onClose={() => {setUserClaimed(false)}}>Already claimed</Alert>
                    )}
    </div>
  );
};

export default ProjectDetails;
