import { motion, useInView } from "motion/react";
import StatsCard from "../components/StatsCard";
import { useState, useRef, useEffect } from "react";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";

import Revenue from "../components/charts/Revenue";
import ProjectStatus from "../components/charts/ProjectStatus";
import TopProjects from "../components/TopProjects";
import WorkLoad from "../components/WorkLoad";
import WlBreakdown from "../components/WlBreakdown";
import OverviewMatrics from "../components/OverviewMatrics";

import RecentActivitySection from "../components/RecentActivitySection";
import { ChartColumnIncreasing } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Overview = () => {
  return (
    <div className="space-y-10 flex flex-col mb-5">
      {/* page title */}
      <Helmet>
        <title>Overview | Dev Workspace</title>
      </Helmet>

      <h1 role="heading" className="text-3xl heading-font font-semibold">
        Overview
      </h1>

      {/* summary / matrics */}
      <OverviewMatrics />

      {/* charts & analytics */}
      <div className="flex gap-4 pb-3 w-full sm:flex-nowrap overflow-x-auto smScrollVr flex-wrap overflow-y-hidden">
        <Revenue />
        <ProjectStatus />
      </div>

      {/* recent activity section */}
      <RecentActivitySection />

      <div className="flex sm:flex-row sm:overflow-auto smScrollVr pb-3 flex-col gap-4">
        {/* Workload */}
        <div className="bg-white shadow-md rounded-lg p-5 flex justify-center items-center sm:basis-100 shrink-0">
          <WorkLoad />
        </div>

        {/* workload breakdown */}
        <div className="bg-white rounded-lg p-5 sm:grow sm:min-w-auto min-w-120 sm:basis-120 shrink-0 space-y-4 shadow-md">
          <WlBreakdown />
        </div>

        {/* top projects */}
        <div className="bg-white sm:basis-100 grow shrink-0 rounded-lg shadow-md">
          <TopProjects />
        </div>
      </div>
    </div>
  );
};

export default Overview;
