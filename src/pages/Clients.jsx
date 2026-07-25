import React from "react";
import ClientMatrics from "../components/ClientMatrics";
import ClientInteract from "../components/ClientInteract";
import TopClients from "../components/TopClients";
import { Helmet } from "react-helmet-async";

const Clients = () => {
  return (
    <div className="mb-5 space-y-10">
      <Helmet>
        <title>Client & Message | Dev Workspace</title>
      </Helmet>

      <h1 role="heading" className="text-3xl heading-font font-semibold">
        Client & Message
      </h1>

      <ClientMatrics />
      <ClientInteract />
      <TopClients />
    </div>
  );
};

export default Clients;
