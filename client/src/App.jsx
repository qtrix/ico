import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home,Dashboard,ICO_Home,Transfer, Wallet} from "./pages";
import ProjectDetails from "./components/ProjectDetails";
import ManageProject from "./components/ManageProject";
import ICO from "./pages/ico/ICO";
import { Navbar, Sidebar } from "./components";

import BlocksPage from "./components/BlocksPage";
import TransactionPage from "./components/TransactionPage";
const App = () => {
  return (
    <div className="relative bg-[#13131a] sm:-8 p-4 flex flex-row min-h-screen  ">
      <div className="sm:flex hidden mr-10 relative text-white">
        <Sidebar />
      </div>
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/ico" element={<ICO_Home/>} />
          <Route path="/project-details/:id" element={<ProjectDetails />} />
          <Route path="/project-details/management/:id" element={<ManageProject />} />
          <Route path = "/ico/add-project" element = {<ICO/>} />
          <Route path = "/dashboard/blocks/:id" element = {<BlocksPage/>} />
          <Route path = "/dashboard/transactions/:txHash" element = {<TransactionPage/>} />
          <Route path = "/transfer" element = {<Transfer />} />
          <Route path = "/wallet" element = {<Wallet />} />
        </Routes>
      </div>

    </div>
  );
};

export default App;
