import React, { useEffect, useState } from "react";
import DashboardPage from "../components/DashboardPage";
import './home.css'
const Dashboard = () => {
    const [isActive, setIsActive] = useState("dashboard");
    return(
        <div>
            <h1 className="font-epilogue font-semibold text-[20px] text-white text-left"> {"Dashboard"} </h1>
            <DashboardPage/>
        </div>
  
    );
};

export default Dashboard;
