import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context";
import DisplayProjects from "../../components/DisplayProjects";
const Projects = (projects) => {
    const [isLoading, setIsLoading] = useState(false);

    return(
        <div class = "mt-4">
            <DisplayProjects
            title="All projects"
            isLoading={isLoading}
            projects={projects.projects}
            isManagement = {false}
            />
        </div>
    )
}

export default Projects