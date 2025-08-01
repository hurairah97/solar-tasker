import React from "react";
import { Sidebar, Menu, MenuItem } from "react-mui-sidebar";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import AssignmentReturnedOutlinedIcon from "@mui/icons-material/AssignmentReturnedOutlined";
import LowPriorityOutlinedIcon from "@mui/icons-material/LowPriorityOutlined";
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Link, useLocation } from "react-router";
import UserProfile from "./components/UserProfile";
import  logo from '../src/assets/Logo.png';
import  smallLogo from '../src/assets/Small-logo.png';
import { jwtDecode } from "jwt-decode";

const AppSidebar = ({ open, isCollapse, setIsCollapse }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userData = jwtDecode(token);
  console.log(userData);
  
  return (
    <>
      <Sidebar
        isCollapse={isCollapse}
        width={isCollapse ? "80px" : "275px"}
        showProfile={false}
      >
        <div className="w-full sticky top-0 bg-white z-10 logo">
          {!isCollapse ? (
            <div className="p-5">
              <img src={logo}/>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="174"
                height="26"
                fill="none"
              >
                <path
                  fill="#11142D"
                  d="M46.027 23V5.12h3.12l6.696 9.096h-1.488l6.552-9.096h3.12V23h-3.288V8.84l1.272.312-6.792 9.048h-.384L48.21 9.152l1.08-.312V23zm27.542.288q-1.92 0-3.504-.888a6.84 6.84 0 0 1-2.496-2.424q-.912-1.536-.912-3.504t.912-3.504a6.84 6.84 0 0 1 2.496-2.424q1.56-.888 3.504-.888 1.92 0 3.48.888a6.66 6.66 0 0 1 2.472 2.424q.936 1.512.936 3.504 0 1.968-.936 3.504a6.84 6.84 0 0 1-2.496 2.424q-1.56.888-3.456.888m0-2.88q1.056 0 1.848-.504.816-.504 1.272-1.392.48-.912.48-2.04 0-1.152-.48-2.016a3.45 3.45 0 0 0-1.272-1.392q-.792-.528-1.848-.528-1.08 0-1.896.528-.816.504-1.296 1.392-.456.864-.456 2.016 0 1.128.456 2.04.48.888 1.296 1.392t1.896.504m15.344 2.88q-1.896 0-3.384-.888a6.6 6.6 0 0 1-2.352-2.472q-.864-1.56-.864-3.456 0-1.92.864-3.456a6.64 6.64 0 0 1 2.352-2.448q1.512-.912 3.36-.912 1.488 0 2.64.6a4.47 4.47 0 0 1 1.848 1.632l-.48.648V4.832h3.144V23h-2.976v-2.52l.336.624q-.672 1.056-1.872 1.632-1.2.552-2.616.552m.336-2.88q1.08 0 1.896-.504t1.272-1.392q.48-.888.48-2.04 0-1.128-.48-2.016a3.4 3.4 0 0 0-1.272-1.416q-.816-.504-1.896-.504-1.056 0-1.896.528-.84.504-1.32 1.392-.456.864-.456 2.016t.456 2.04q.48.888 1.32 1.392t1.896.504m15.909 2.88q-2.016 0-3.528-.912a6.35 6.35 0 0 1-2.352-2.472q-.84-1.56-.84-3.456 0-1.968.84-3.48a6.5 6.5 0 0 1 2.328-2.424q1.488-.888 3.312-.888 1.536 0 2.688.504 1.176.504 1.992 1.392t1.248 2.04q.432 1.128.432 2.448 0 .336-.048.696-.024.36-.12.624h-10.08v-2.4h8.304l-1.488 1.128q.216-1.104-.12-1.968a2.73 2.73 0 0 0-1.056-1.368q-.72-.504-1.752-.504-.984 0-1.752.504-.768.48-1.176 1.44-.384.936-.288 2.28-.096 1.2.312 2.136.432.912 1.248 1.416.84.504 1.92.504t1.824-.456a3.26 3.26 0 0 0 1.2-1.224l2.544 1.248a4.45 4.45 0 0 1-1.2 1.656 6 6 0 0 1-1.944 1.128q-1.104.408-2.448.408m8.503-.288V9.944h2.952v2.904l-.24-.432q.456-1.464 1.416-2.04.984-.576 2.352-.576h.768v2.784h-1.128q-1.344 0-2.16.84-.816.816-.816 2.304V23zm8.977 0V9.944h2.952v2.568l-.24-.456q.456-1.176 1.488-1.776 1.056-.624 2.448-.624 1.44 0 2.544.624 1.128.624 1.752 1.752.624 1.104.624 2.568V23h-3.144v-7.656q0-.864-.336-1.488a2.35 2.35 0 0 0-.936-.96q-.576-.36-1.368-.36-.768 0-1.368.36-.6.336-.936.96t-.336 1.488V23zm14.226 0V9.944h3.144V23zm0-14.52V5.12h3.144v3.36zM141.783 23v-2.544l7.584-8.784.48 1.08h-7.728V9.944h10.512v2.568l-7.44 8.784-.48-1.08h7.968V23zm18.875.288q-2.016 0-3.528-.912a6.35 6.35 0 0 1-2.352-2.472q-.84-1.56-.84-3.456 0-1.968.84-3.48a6.5 6.5 0 0 1 2.328-2.424q1.488-.888 3.312-.888 1.536 0 2.688.504 1.176.504 1.992 1.392t1.248 2.04q.432 1.128.432 2.448 0 .336-.048.696-.024.36-.12.624h-10.08v-2.4h8.304l-1.488 1.128q.216-1.104-.12-1.968a2.73 2.73 0 0 0-1.056-1.368q-.72-.504-1.752-.504-.984 0-1.752.504-.768.48-1.176 1.44-.384.936-.288 2.28-.096 1.2.312 2.136.432.912 1.248 1.416.84.504 1.92.504t1.824-.456a3.26 3.26 0 0 0 1.2-1.224l2.544 1.248a4.45 4.45 0 0 1-1.2 1.656 6 6 0 0 1-1.944 1.128q-1.104.408-2.448.408"
                ></path>
                <path
                  fill="#615DFF"
                  d="M20.137 26c2.761 0 5.047-2.258 4.536-4.971a26.7 26.7 0 0 0-1.45-4.979 26.1 26.1 0 0 0-5.448-8.435A25.1 25.1 0 0 0 9.619 1.98 24.5 24.5 0 0 0 4.965.512C2.262-.05 0 2.24 0 5v16a5 5 0 0 0 5 5z"
                ></path>
                <path
                  style={{
                    mixBlendMode: "multiply",
                  }}
                  fill="#3DD9EB"
                  d="M13.701 26c-2.761 0-5.047-2.258-4.536-4.971.32-1.702.805-3.37 1.45-4.979a26.1 26.1 0 0 1 5.449-8.435 25.1 25.1 0 0 1 8.155-5.636A24.5 24.5 0 0 1 28.873.512C31.577-.05 33.838 2.24 33.838 5v16a5 5 0 0 1-5 5z"
                ></path>
              </svg> */}
            </div>
          ) : (
            <div className="p-5">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="174"
                height="26"
                fill="none"
              >
                <path
                  fill="#615DFF"
                  d="M20.137 26c2.761 0 5.047-2.258 4.536-4.971a26.7 26.7 0 0 0-1.45-4.979 26.1 26.1 0 0 0-5.448-8.435A25.1 25.1 0 0 0 9.619 1.98 24.5 24.5 0 0 0 4.965.512C2.262-.05 0 2.24 0 5v16a5 5 0 0 0 5 5z"
                ></path>
                <path
                  fill="#3DD9EB"
                  d="M13.701 26c-2.761 0-5.047-2.258-4.536-4.971.32-1.702.805-3.37 1.45-4.979a26.1 26.1 0 0 1 5.449-8.435 25.1 25.1 0 0 1 8.155-5.636A24.5 24.5 0 0 1 28.873.512C31.577-.05 33.838 2.24 33.838 5v16a5 5 0 0 1-5 5z"
                  style={{
                    mixBlendMode: "multiply",
                  }}
                ></path>
              </svg> */}
               <img src={smallLogo}/>
            </div>
          )}
        </div>
        <Menu subHeading="HOME">
          <Link to="/">
            <MenuItem
              icon={
                <Groups3OutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/" ? "text-white" : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/" ? "/" : ""}
              badge="true"
              badgeContent="New"
            >
              Clients
            </MenuItem>
          </Link>

          <Link to="/region">
            <MenuItem
              icon={
                <CottageOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/region"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/region" ? "/" : ""}
            >
              Region
            </MenuItem>
          </Link>

          <Link to="/worker">
            <MenuItem
              icon={
                <EngineeringOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/worker"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/worker" ? "/" : ""}
            >
              Workers
            </MenuItem>
          </Link>

          <Link to="/team">
            <MenuItem
              icon={
                <Diversity3OutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/team"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/team" ? "/" : ""}
            >
              Team
            </MenuItem>
          </Link>
        </Menu>

        <Menu subHeading="TASKS">
          <Link to="/tasks">
            <MenuItem
              icon={
                <TaskAltOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/tasks"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/tasks" ? "/" : ""}
              // badge="true"
            >
              TASKS
            </MenuItem>
          </Link>
          <Link to="/upcoming-task">
            <MenuItem
              icon={
                <AssignmentReturnedOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/upcoming-task"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/upcoming-task" ? "/" : ""}
            >
              Upcomming Tasks
            </MenuItem>
          </Link>
          <Link to="/missed-task">
            <MenuItem
              icon={
                <LowPriorityOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/missed-task"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/missed-task" ? "/" : ""}
            >
              Missed Tasks
            </MenuItem>
          </Link>
          <Link to="/liveTracking">
            <MenuItem
              icon={
                <LocationSearchingIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/liveTracking"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/liveTracking" ? "/" : ""}
            >
              Live Tracking
            </MenuItem>
          </Link>{" "}
          <Link to="/feedback">
            <MenuItem
              icon={
                <FeedbackOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/feedback"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/feedback" ? "/" : ""}
            >
              Feedbacks
            </MenuItem>
          </Link>
        </Menu>
        <Menu subHeading="ADMIN">
          <Link to="/user">
            <MenuItem
              icon={
                <GroupAddOutlinedIcon
                  fontSize="small"
                  className={`${
                    location.pathname === "/user"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                />
              }
              link={location.pathname === "/user" ? "/" : ""}
            >
              Users
            </MenuItem>
          </Link>
        </Menu>

        <UserProfile
          userName={userData?.username}
          userimg="https://modernize-react.adminmart.com/assets/user-1-CznVQ9Sv.jpg"
          designation="Admin"
          isCollapse={isCollapse}
        />
      </Sidebar>
    </>
  );
};

export default AppSidebar;
