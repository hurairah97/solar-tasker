import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { notification } from "antd";

const UserProfile = ({
  userName,
  designation,
  userimg,
  isCollapse = false,
}) => {
  const handleLogout = async () => {
    await localStorage.removeItem("token");
    notification.success({
      message: "Logout successfully!",
      description: `You have been Logout Successfully`,
      placement: "topRight",
    });
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  };
  
  return (
    <div className="sticky bottom-[20px] z-10">
      {isCollapse ? (
        ""
      ) : (
        <div className="flex items-center justify-between p-4 m-5 bg-[#E8F7FF] rounded-lg ">
          {/* Profile Information */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <Avatar alt="user" src={userimg} sx={{ width: 40, height: 40 }} />
            {/* Name and Designation */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {userName}
              </h2>
              <p className="text-xs text-gray-500">{designation}</p>
            </div>
          </div>
          {/* Power Icon */}
          <Tooltip title="Logout" placement="top">
            <button
              onClick={handleLogout}
              className="text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <PowerSettingsNewIcon />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
