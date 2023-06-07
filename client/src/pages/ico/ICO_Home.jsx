import React, { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Overview from './overview';
import Projects from "./projects";
import Management from "./management";
import Alert from '@mui/material/Alert';
import { useStateContext } from "../../context";

const ICO_Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("overview");
  const [isActive, setIsActive] = useState("ico");
  const [projects, setProjects] = useState([]);
  const [wrongNetwork,setWrongNetwork] = useState("");
  const {address, contract, getProjects} = useStateContext();

  const fetchProjects  = async () => {
    setIsLoading(true)
    const [data,error] = await getProjects();
    console.log(data,error)
    if(error != ""){
      setIsLoading(false);
      setWrongNetwork(error);
      return;
    }

    setProjects(data);
    setIsLoading(false);
  }
  useEffect(() => {
      if (contract) fetchProjects();
      return () => {
        console.log('This will be logged on unmount');
      };
    }, [address, contract]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="secondary"
        aria-label=""
        >
        <Tab value="overview" label="Overview" style={{ color: "white" }} />
        <Tab value="projects" label="Projects"  style={{ color: "white" }}/>
        <Tab value="management" label="Management" style={{ color: "white" }} />
      </Tabs>
    {wrongNetwork != "" &&   <Alert  variant="filled" severity="warning" onClose={() => {setWrongNetwork("")}}>{wrongNetwork}</Alert> }
    //{value == "overview"  ? <Overview projects={projects} /> : value == "projects" ? <Projects projects={projects}/> :  value == "management" ? <Management projects={projects}/> : <div></div>}
  </div>
  );
};

export default ICO_Home;
