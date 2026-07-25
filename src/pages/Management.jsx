import React from "react";
import ManageMember from "../components/ManageMember";
import ManageProjects from "../components/ManageProjects";
import ScrollToHash from "../components/ScrollToHash";
import ManageCompletedSec from "../components/ManageCompletedSec";
import ProjectMonitor from "../components/ProjectMonitor";
import ProjectWatchlist from "../components/ProjectWatchlist";
import { Helmet } from "react-helmet-async";

const Management = () => {
  return (
    <div className="space-y-10 flex flex-col mb-5 w-full">
      {/* page title */}
      <Helmet>
        <title>Management | Dev Workspace</title>
      </Helmet>

      <ScrollToHash />
      <h1 role="heading" className="text-3xl heading-font font-semibold">
        Management
      </h1>

      <ManageMember />

      <ProjectMonitor />

      <ManageProjects />

      <ProjectWatchlist />

      <hr className="border-t border-gray-400" />

      <ManageCompletedSec />
    </div>
  );
};

export default Management;
