import React from "react";
import TeamMemberMatrics from "../components/TeamMemberMatrics";
import AcativeMembers from "../components/AcativeMembers";
import TeamAlertsSection from "../components/TeamAlertsSection";
import TeamDirectory from "../components/TeamDirectory";
import ScrollToHash from "../components/ScrollToHash";
import { Helmet } from "react-helmet-async";

const TeamMembers = () => {
  return (
    <div className="space-y-10 mb-5">
      <Helmet>
        <title>Team members | Dev Workspace</title>
      </Helmet>

      <ScrollToHash />
      <h1
        role="heading"
        className="text-3xl heading-font font-semibold"
      >
        Team Members
      </h1>

      <TeamMemberMatrics />
      <section className="@container">
        <AcativeMembers />
      </section>
      
      <TeamAlertsSection />

      <TeamDirectory />
    </div>
  );
};

export default TeamMembers;
