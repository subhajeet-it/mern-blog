import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashSideBar } from "../components/DashSideBar";
import { DashProfile } from "../components/DashProfile";
import { Dashposts } from "../components/Dashposts";
import DashUsers from '../components/DashUsers';

export const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSideBar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <Dashposts />}
      {tab === "users" && <DashUsers />}
    </div>
  );
};
