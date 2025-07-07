import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import { MenuItem } from "react-mui-sidebar";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Modal, List, notification } from "antd"; // Import Ant Design components
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Buttons from "./button/Button";
import CreateDialog from "./createDialog/CreateDialog";
import { useLocation } from "react-router";
import Routing from "../Routing";

const Navbar = ({ isCollapse, setIsCollapse }) => {
  const isMobile = useMediaQuery("(max-width:500px)");
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const [btnName, setBtnName] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const settings = [
    // {
    //   id: 1,
    //   icon: <PersonPinRoundedIcon fontSize="small" />,
    //   name: "Profile",
    // },
    // {
    //   id: 2,
    //   icon: <AccountCircleRoundedIcon fontSize="small" />,
    //   name: "Account",
    // },
    {
      id: 3,
      icon: <ExitToAppRoundedIcon fontSize="small" />,
      name: "Logout",
    },
  ];

  // const notifications = [
  //   {
  //     id: 1,
  //     title: "Cleaning Task Assigned to Team Alpha",
  //     description:
  //       "The Team should clean all the Solar plates and mark their task done through WhatsApp notification.",
  //       date: "2025-01-26 10:15 AM",
  //   },

  //   {
  //     id: 2,
  //     title: "Maintenance Update",
  //     description: "The system will undergo maintenance at 2 AM tomorrow.",
  //     date: "2025-01-26 10:15 AM",

  //   },
  //   {
  //     id: 3,
  //     title: "Cleaning Task Assigned to Team Alpha",
  //     description:
  //       "The Team should clean all the Solar plates and mark their task done through WhatsApp notification.",
  //       date: "2025-01-26 10:15 AM",

  //   },
  //   {
  //     id: 4,
  //     title: "Maintenance Update",
  //     description: "The system will undergo maintenance at 2 AM tomorrow.",
  //     date: "2025-01-26 10:15 AM",

  //   },
  //   {
  //     id: 5,
  //     title: "Cleaning Task Assigned to Team Alpha",
  //     description:
  //       "The Team should clean all the Solar plates and mark their task done through WhatsApp notification.",
  //       date: "2025-01-26 10:15 AM",

  //   },
  //   {
  //     id: 6,
  //     title: "Maintenance Update",
  //     description: "The system will undergo maintenance at 2 AM tomorrow.",
  //     date: "2025-01-26 10:15 AM",

  //   },
  // ];

  const [notifications, setNotifications] = useState([]);
  console.log(notifications);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connected.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        // Set past notifications when first loaded
        setNotifications(data.notifications);
      }

      if (data.type === "new") {
        // Add new notification to the list
        setNotifications((prevNotifications) => [data.notification, ...prevNotifications]);

        // Display notification using Ant Design
        notification.open({
          message: "New Notification",
          description: data.notification.message,
          placement: "topRight",
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error.message);
    };

    return () => {
      ws.close();
    };
  }, []);



  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSidebar = () => {
    setIsCollapse((prev) => !prev);
  };

  const location = useLocation();
  useEffect(() => {
    const btnName = location.pathname.replace("/", ""); // remove / from url
    const capitalName = btnName.charAt(0).toUpperCase() + btnName.slice(1); // make first word cap
    setBtnName(capitalName);
  }, [location]);

  const handleOpenNotifcationMenu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

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
    <>
      <AppBar
        position="static"
        className="bg-white shadow-sm w-full nav-bar"
        elevation={0}
      >
        <Toolbar className="flex justify-between w-full tool-bar">
          <div className="flex items-center space-x-3">
            <div className="hide-icon">
              <IconButton onClick={handleSidebar}>
                <MenuOutlinedIcon
                  className={`text-gray-700 z-10 ${
                    isCollapse
                      ? "rotate-180"
                      : "transition-transform duration-300"
                  } `}
                />
              </IconButton>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {["/", "/region", "/worker", "/team", "/user"].includes(
              location.pathname
            ) && (
              <>
                <Buttons
                  text={`Add New ${
                    location.pathname === "/" ? "Client" : btnName
                  }`}
                  type="primary"
                  size={isMobile ? "medium" : "large"}
                  icon={<AddCircleIcon sx={{ fontSize: isMobile ? 18 : 22 }} />}
                  styling={"linearGradient"}
                  onClick={() => setIsDialogOpen(true)}
                />
                <CreateDialog
                  title={`Add New ${
                    location.pathname === "/" ? "Client" : btnName
                  }`}
                  isDialogOpen={isDialogOpen}
                  handleDialogClose={() => setIsDialogOpen(false)}
                  path={location.pathname}
                />
              </>
            )}

            {/* {!isMobile && (
              <>
                <IconButton>
                  <LanguageIcon className="text-gray-700" />
                </IconButton>

                <IconButton>
                  <Badge badgeContent={0} color="error">
                    <ShoppingCartIcon className="text-gray-700" />
                  </Badge>
                </IconButton>
              </>
            )} */}

            <IconButton onClick={handleOpenNotifcationMenu} sx={{ p: 0 }}>
              <Badge
                variant={notifications.length > 0 ? "dot" : ""}
                color="primary"
              >
                <NotificationsIcon
                  className={
                    anchorElNotification === null
                      ? "text-gray-700"
                      : "text-primary"
                  }
                />
              </Badge>
            </IconButton>
            <Menu
              id="notification-menu"
              anchorEl={anchorElNotification}
              open={Boolean(anchorElNotification)}
              onClose={handleCloseNotificationMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{ mt: "40px" }}
              PaperProps={{
                sx: { width: "400px", height: "500px" }, // Ensures the paper width is set
              }}
            >
              <div className="p-4 font-semibold">
                Notifications
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-col font-semibold items-start p-4 hover:bg-gray-100 rounded-lg cursor-pointer "
                  >
                    {/* Notification Title and Icon */}
                    <div className="flex items-center space-x-3">
                      <Avatar
                        className="bg-primary text-white"
                        sx={{ width: 32, height: 32 }}
                      >
                        <NotificationsIcon fontSize="small" />
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        className="font-semibold text-gray-800"
                      >
                        {notification.message}
                      </Typography>
                    </div>

                    {/* Notification Description */}
                    {/* <Typography
                      variant="body2"
                      className="text-sm text-gray-600 mt-2"
                    >
                      {notification.message}
                    </Typography> */}

                    {/* Notification Date and Time */}
                    <div className="w-full text-end">
                      <Typography
                        variant="caption"
                        className="text-xs text-primary mt-1 "
                      >
                        {notification.created_at?.slice(0,10)}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Menu>

            {!isMobile && (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://modernize-react.adminmart.com/assets/user-1-CznVQ9Sv.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      icon={setting.icon}
                      key={setting.id}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography
                        sx={{ textAlign: "center" }}
                        onClick={
                          setting.name === "Logout" ? handleLogout : null
                        }
                      >
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
