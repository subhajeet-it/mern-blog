import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocument,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
export const DashSideBar = () => {
  const currentUser=useSelector(state=>state.user);

  
  const location = useLocation();
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.currentUser.isAdmin?'Admin':'User'}
            labelColor="dark"
            onClick={() => navigate("/dashboard?tab=profile")}
          >
            Profile
          </Sidebar.Item>
          {currentUser.currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              label={"Post"}
              labelColor="dark"
              onClick={() => navigate("/dashboard?tab=posts")}
            >
              Posts
            </Sidebar.Item>
          )}
          {currentUser.currentUser.isAdmin && (
            
            <Sidebar.Item
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              label={"User"}
              labelColor="dark"
              onClick={() => navigate("/dashboard?tab=users")}
            >
              Users
            </Sidebar.Item>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
