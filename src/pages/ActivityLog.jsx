import React from "react";
import ActivityMatrics from "../components/ActivityMatrics";
import ActivityAnalytics from "../components/ActivityAnalytics";
import ActivityFeed from "../components/ActivityFeed";
import ScrollToHash from "../components/ScrollToHash";
import { Helmet } from "react-helmet-async";

const ActivityLog = () => {
  return (
    <div className="mb-5 space-y-10">
      <Helmet>
        <title>Activity Log | Dev Workspace</title>
      </Helmet>

      <ScrollToHash />
      <h1
        role="heading"
        className="text-3xl heading-font font-semibold"
      >
        Activity Log
      </h1>

      <ActivityMatrics />

      <ActivityAnalytics />

      <ActivityFeed />
    </div>
  );
};

export default ActivityLog;
