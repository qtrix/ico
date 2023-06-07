import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';


const Overview = (projects) => {
    const [isLoading, setIsLoading] = useState(false);

    const overview = {
        NoOfProjects : projects.projects.length,
        TotalAmountCollected : projects.projects.reduce((accumulator, project) => accumulator + project.amountCollected, 0),
        TotalRewards :projects.projects.reduce((accumulator, project) => accumulator + project.rewards, 0),
    };

    return(
        <div class = "mt-4">
            <div class="flex items-stretch w-full ">
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[150px]  py-4 flex flex-col items-center m-2 sm:m-4">
                <div class="w-full h-32 sm:h-48 relative flex items-end justify-center">
                    <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                        <span class="mdi mdi:database-cog-outline text-xl sm:text-2xl text-indigo-500">
                        <Icon icon="mdi:database-cog-outline" />
                        </span>
                    </div>
                    <p class="text-blue-900 text-xl sm:text-2xl font-bold leading-tight mt-2 sm:mt-4">{overview.NoOfProjects}</p>
                    <p class="text-gray-500 text-xs font-semibold">No of Projects</p>
                    </div>
                </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[150px]  py-4 flex flex-col items-center m-2 sm:m-4">
                <div class="w-full h-32 sm:h-48 relative flex items-end justify-center">
                    <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                        <span class="mdi mdi:cash-refund text-xl sm:text-2xl text-indigo-500">
                        <Icon icon="mdi:cash-refund" />
                        </span>
                    </div>
                    <p class="text-blue-900 text-xl sm:text-2xl font-bold leading-tight mt-2 sm:mt-4">{overview.TotalRewards}</p>
                    <p class="text-gray-500 text-xs font-semibold">Total rewards</p>
                    </div>
                </div>
                </div>
                <div class="bg-white rounded-xl border border-gray-300 w-full  h-[150px]  py-4 flex flex-col items-center m-2 sm:m-4">
                <div class="w-full h-32 sm:h-48 relative flex items-end justify-center">
                    <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                        <span class="mdi text-xl sm:text-2xl text-indigo-500">
                        <Icon icon="mdi:currency-usd" />
                        </span>
                    </div>
                    <p class="text-blue-900 text-xl sm:text-2xl font-bold leading-tight mt-2 sm:mt-4">{overview.TotalAmountCollected}</p>
                    <p class="text-gray-500 text-xs font-semibold">Total USDC Funded</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
    )
}

export default Overview;