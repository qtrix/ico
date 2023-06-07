import React from "react";
import { useNavigate } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";


const DisplayProjects = ({ title, isLoading, projects ,isManagement}) => {
    const navigate = useNavigate();
  
    const handleNavigate = (project) => {
      navigate(`/project-details/${project.title}`, { state: project });
    };

    const handleNavigateManagement = (project) => {
      navigate(`/project-details/management/${project.title}`, { state: project });
    };
  
    return (
      <div>
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
          {title} ({projects.length})
        </h1>
  
        <div className="flex flex-wrap mt-[20px] gap-[26px]">
          {isLoading && (
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain"
            />
          )}
  
          {!isLoading && projects.length === 0 && (
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
              There are no projects yet!
            </p>
          )}
  
          {!isLoading &&
            projects.length > 0 &&
            projects.map((project) => (
              <FundCard
                key={project.pId}
                {...project}
                handleClick={() => {!isManagement ? handleNavigate(project) : handleNavigateManagement(project)}}
              />
            ))}
        </div>
      </div>
    );
  };
  
export default DisplayProjects;