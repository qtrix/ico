import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DisplayProjects from "../../components/DisplayProjects";
import Button from '@mui/material/Button';
import ICO from "./ICO";
import { useStateContext } from "../../context";

const Management = (projects) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState("ico");
    const [btnPressed, setBtnPressed] = useState(false);
    const {address } = useStateContext();
    const filteredProjects = projects.projects.filter(project => project.owner.toLowerCase() === address.toLowerCase() );

    return(
        <div>
        <div class="mt-4 flex justify-between items-center">
            {!btnPressed ? <h2 class="font-bold text-2xl text-white">Your Projects</h2> : <p></p>}
            {!btnPressed ? <Button variant="contained" 
                    size="medium"  
                    style={{ backgroundColor: "#1dc071" } } 
                    onClick  = {() =>  {
                        setIsActive("ico");
                        setBtnPressed(true);
                      }}>
                        Add Project</Button>
                        : <Button variant="contained" 
                        size="medium"  
                        style={{ backgroundColor: "#1dc071" } } 
                        onClick  = {() =>  {
                            setIsActive("ico");
                            setBtnPressed(false);
                          }}>
                            Back to management</Button>
            }
        </div>
        {btnPressed ? <ICO /> :
        <DisplayProjects
            isLoading={isLoading}
            projects={filteredProjects}
            isManagement = {true}
        />  }
      </div>
    )
}

export default Management