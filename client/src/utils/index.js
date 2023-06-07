export const trimAddress = (address) => {
  const str = new String(address);
  return str.substring(0,15);
}

export const daysLeft = (startTimestamp,endTimestamp) => {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const remainingDays = Math.floor(timeDiff / (3600 * 24));
    return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const calculateProjectState = (startTimestamp,endTimestamp,target,raisedAmount) => {
    if(startTimestamp >  Math.floor((new Date(Date.now())).getTime() / 1000)){
      return ["NotStarted", "danger"];
    }else if( endTimestamp < Math.floor((new Date(Date.now())).getTime() / 1000)){
      return ["Finished", "success"];
    }else if(raisedAmount == target){
      return ["TargetAmountHit" ,"success"];
    }

    return ["In progress", "warning"];

  }

export const calculateAmountWithDecimals = (amount,decimals)=>{
  return Math.round(amount/(10**decimals));
}

export const calcultateUserRewards = (userFund, targetAmount,raisedAmount,rewardsAmount) => {
  var equityToDistribute = (rewardsAmount * raisedAmount) / targetAmount;

  var equityAmount = (userFund * equityToDistribute) / raisedAmount

  return equityAmount > 0 ? equityAmount : 0
}

export const hoursLeft = (startTimestamp,endTimestamp) => {
  const hourDiff = Math.floor((endTimestamp - startTimestamp) / 3600);
  console.log("hours " + hourDiff)
  return hourDiff.toFixed(0);
};