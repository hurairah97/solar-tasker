import React from "react";
import { Avatar, Tag } from "antd";

// Clients Columns

// Function to generate a random light color
const getRandomLightColor = () => {
  const colors = [
    "#FFC0CB", // Light Pink
    "#FFDAB9", // Peach Puff
    "#FFB6C1", // Light Pink 2
    "#E6E6FA", // Lavender
    "#D8BFD8", // Thistle
    "#FFFACD", // Lemon Chiffon
    "#F5F5DC", // Beige
    "#ADD8E6", // Light Blue
    "#E0FFFF", // Light Cyan
    "#F0E68C", // Khaki
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to generate a random slightly dark color for the text
const getRandomDarkColor = () => {
  const colors = [
    "#4B0082", // Indigo
    "#6A5ACD", // Slate Blue
    "#8B4513", // Saddle Brown
    "#2F4F4F", // Dark Slate Gray
    "#800000", // Maroon
    "#556B2F", // Dark Olive Green
    "#4B5320", // Army Green
    "#483D8B", // Dark Slate Blue
    "#708090", // Slate Gray
    "#2E8B57", // Sea Green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to assign colors to different plan status
const getPlanTagColor = (plan) => {
  switch (plan) {
    case 0:
      return "#5D87FF"; // Shipped-like color

    case 1:
      return "#13DEB9"; // Delivered-like color

    case "Trial":
      return "orange"; // Pending-like color
    default:
      return "default"; // Default color for undefined plans
  }
};

// Function to assign colors to different Response status
const getResponseTagColor = (response) => {
  switch (response) {
    case 2:
      return " #F9886A"; // RED-like color
    case 1:
      return "#13DEB9"; // Delivered-like color   #13DEB9
    case 0:
      return "#F5BC00";
    default:
      return "default"; // Default color for undefined plans
  }
};

export const clientColumns = [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    width: 150,
    fixed: "left",
    sorter: (a, b) => a.name.length - b.name.length,
    render: (_, record) => {
      const backgroundColor = getRandomLightColor();
      const textColor = getRandomDarkColor();

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor,
              color: textColor, // Apply random dark text color
              verticalAlign: "middle",
              marginRight: "10px",
            }}
            size="large"
          >
            {record.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <div>
            <div className="text-black font-semibold text-xs">
              {record.name}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
    sorter: (a, b) => a.email.length - b.email.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 200,
    sorter: (a, b) => a.address.length - b.address.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 120,
    sorter: (a, b) => a.amount - b.amount,
    render: (value) => `$${value}`,
  }, // Format as currency

  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
    width: 150,
    sorter: (a, b) => a.plan - b.plan,
    render: (plan) => (
      <Tag
        color={getPlanTagColor(plan)}
        style={{
          fontSize: "12px",
          padding: "2px 2px",
          borderRadius: "10px",
          textAlign: "center",
          width: "100px",
          color: "white",
        }}
      >
        {plan === 0 ? "Basic" : plan === 1 ? "Premium" : ""}
      </Tag>
    ),
  },
  {
    title: "Service Plan Duration",
    dataIndex: "service_plan_duration",
    key: "service_plan_duration",
    width: 200,
    sorter: (a, b) => a.service_plan_duration - b.service_plan_duration,
    render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Last Service Data",
    dataIndex: "last_service_date",
    key: "last_service_date",
    width: 180,
    sorter: (a, b) => a.last_service_date - b.last_service_date,
    render: (row) => row || "N/A",
  },

  {
    title: "Upcoming Service Data",
    dataIndex: "upcoming_service_date",
    key: "upcoming_service_date",
    width: 200,
    sorter: (a, b) => a.upcoming_service_date - b.upcoming_service_date,
    render: (row) => row || "N/A",
  },
];

// Region Columns

export const regionColumns = [
  {
    title: "Area",
    dataIndex: "area",
    key: "area",
    width: 200,
    sorter: (a, b) => a.area.length - b.area.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "Region",
    dataIndex: "region",
    key: "region",
    width: 200,
    sorter: (a, b) => a.region.length - b.region.length,
    render: (row) => <span className="">{row}</span>,
  },
];

// workers Column

export const workerColumns = [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    width: 150,
    fixed: "left",
    sorter: (a, b) => a.name.length - b.name.length,
    render: (_, record) => {
      const backgroundColor = getRandomLightColor();
      const textColor = getRandomDarkColor();

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor,
              color: textColor, // Apply random dark text color
              verticalAlign: "middle",
              marginRight: "10px",
            }}
            size="large"
          >
            {record.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "12px",
                color: "black", // Apply random dark text color
              }}
            >
              {record.name}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    title: "CNIC",
    dataIndex: "cnic_number",
    key: "cnic_number",
    width: 200,
    sorter: (a, b) => a.cnic_number - b.cnic_number,
    render: (row) => {
      const nic1 = row.substring(0, 5);
      const nic2 = row.substring(5, 12);
      const nic3 = row.substring(12);
      return row.length > 12 ? `${nic1}-${nic2}-${nic3}` : row;
    },
  },

  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    width: 200,
    sorter: (a, b) => a.number - b.number,
    render: (row) => {
      const numb1 = row.substring(0, 4);
      const numb2 = row.substring(4);
      return `${numb1}-${numb2}`;
    },
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 200,
    sorter: (a, b) => a.address.length - b.address.length,
    render: (row) => <span className="">{row}</span>,
  },
];

// Teams Column

export const teamColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    width: 200,
    sorter: (a, b) => a.team_name.length - b.team_name.length,
    render: (row) => <span className="text-sm font-medium">{row}</span>,
  },
  {
    title: "Team Lead",
    dataIndex: "team_lead",
    key: "team_lead",
    width: 200,
    sorter: (a, b) => a.team_lead.length - b.team_lead.length,
    // render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Team Member 1",
    dataIndex: "member1",
    key: "member1",
    width: 200,
    sorter: (a, b) => a.member1.length - b.member1.length,
    // render: (row) => <span className="">{row}</span>,
  },
  {
    title: "Team Member 2",
    dataIndex: "member2",
    key: "member2",
    width: 200,
    sorter: (a, b) => a.member2.length - b.member2.length,
    render: (row) => row || "N/A",
  },
];

// User Column

export const userColumn = [
  {
    title: "Name",
    key: "user_name",
    dataIndex: "user_name",
    width: 150,
    fixed: "left",
    sorter: (a, b) => a.user_name.length - b.user_name.length,
    render: (_, record) => {
      const backgroundColor = getRandomLightColor();
      const textColor = getRandomDarkColor();

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor,
              color: textColor, // Apply random dark text color
              verticalAlign: "middle",
              marginRight: "10px",
            }}
            size="large"
          >
            {record.user_name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <div>
            <div className="text-black font-semibold text-xs">
              {record.user_name}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: "User Email",
    dataIndex: "email",
    key: "email",
    width: 200,
    sorter: (a, b) => a.email.length - b.email.length,
    render: (row) => <span className="">{row}</span>,
  },

  {
    title: "User Role",
    dataIndex: "role",
    key: "role",
    width: 200,
    sorter: (a, b) => a.role.length - b.role.length,
    render: (row) => <span className="">{row}</span>,
  },
];

// Task Column

export const taskColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    render: (row) => <span className="text-sm font-medium">{row}</span>,
    sorter: (a, b) => a.team_name.localeCompare(b.team_name), // Sort alphabetically
    width: 130,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (row) => <span className="">{row}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    sorter: (a, b) => a.number.localeCompare(b.number), // Sort alphabetically
  },
  {
    title: "Task Status",
    dataIndex: "task_status",
    key: "task_status",
    width: 130,
    render: (task_status) => {
      const getTaskStatusTagColor = (task_status) => {
        switch (task_status) {
          case 0:
            return "#F5BC00"; // Red for Pending
          case 1:
            return "#D4C3A7"; // Black for On The Way
          case 2:
            return "#5D87FF"; // Blue for Working
          case 3:
            return "#13DEB9"; // Green for Completed
          default:
            return "#d9d9d9"; // Gray for Unknown
        }
      };

      const getTaskStatusText = (task_status) => {
        switch (task_status) {
          case 0:
            return "Pending";
          case 1:
            return "On The Way";
          case 2:
            return "Working";
          case 3:
            return "Completed";
          default:
            return "Unknown";
        }
      };

      return (
        <Tag
          color={getTaskStatusTagColor(task_status)}
          style={{
            fontSize: "12px",
            padding: "2px 2px",
            borderRadius: "10px",
            textAlign: "center",
            width: "100px",
            color: "white",
          }}
        >
          {getTaskStatusText(task_status)}
        </Tag>
      );
    },
    sorter: (a, b) => a.task_status - b.task_status, // Sort numerically by status
  },

  {
    title: "Response",
    dataIndex: "response",
    key: "response",
    // render: (response) => (response === 1 ? 'YES' : 'NO'), // Conditional rendering
    render: (response) => (
      <Tag
        color={getResponseTagColor(response)}
        style={{
          fontSize: "12px",
          padding: "2px 2px",
          borderRadius: "10px",
          textAlign: "center",
          width: "100px",
          color: "white",
        }}
      >
        {response === 2 ? "NO" : response === 1 ? "YES" : "Pending"}
      </Tag>
    ),
    sorter: (a, b) => a.response - b.response, // Sort numerically (0 or 1)
    width: 120,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    width: 130,
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), // Sort by date
  },
  {
    title: "Service Date",
    dataIndex: "service_date",
    key: "service_date",
    width: 140,
    sorter: (a, b) => new Date(a.service_date) - new Date(b.service_date), // Sort by date
  },
];

export const upcommingTaskColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    render: (row) => <span className="text-sm font-medium">{row}</span>,
    sorter: (a, b) => a.team_name.localeCompare(b.team_name), // Sort alphabetically
    width: 130,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (row) => <span className="">{row}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    sorter: (a, b) => a.number.localeCompare(b.number), // Sort alphabetically
  },
  {
    title: "Task Status",
    dataIndex: "task_status",
    key: "task_status",
    width: 130,
    render: (task_status) => {
      const getTaskStatusTagColor = (task_status) => {
        switch (task_status) {
          case 0:
            return "#F5BC00"; // Red for Pending
          case 1:
            return "#D4C3A7"; // Black for On The Way
          case 2:
            return "#5D87FF"; // Blue for Working
          case 3:
            return "#13DEB9"; // Green for Completed
          default:
            return "#d9d9d9"; // Gray for Unknown
        }
      };

      const getTaskStatusText = (task_status) => {
        switch (task_status) {
          case 0:
            return "Pending";
          case 1:
            return "On The Way";
          case 2:
            return "Working";
          case 3:
            return "Completed";
          default:
            return "Unknown";
        }
      };

      return (
        <Tag
          color={getTaskStatusTagColor(task_status)}
          style={{
            fontSize: "12px",
            padding: "2px 2px",
            borderRadius: "10px",
            textAlign: "center",
            width: "100px",
            color: "white",
          }}
        >
          {getTaskStatusText(task_status)}
        </Tag>
      );
    },
    sorter: (a, b) => a.task_status - b.task_status, // Sort numerically by status
  },

  {
    title: "Response",
    dataIndex: "response",
    key: "response",
    // render: (response) => (response === 1 ? 'YES' : 'NO'), // Conditional rendering
    render: (response) => (
      <Tag
        color={getResponseTagColor(response)}
        style={{
          fontSize: "12px",
          padding: "2px 2px",
          borderRadius: "10px",
          textAlign: "center",
          width: "100px",
          color: "white",
        }}
      >
        {response === 2 ? "NO" : response === 1 ? "YES" : "Pending"}
      </Tag>
    ),
    sorter: (a, b) => a.response - b.response, // Sort numerically (0 or 1)
    width: 120,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    width: 130,
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), // Sort by date
  },
  {
    title: "Service Date",
    dataIndex: "service_date",
    key: "service_date",
    width: 140,
    sorter: (a, b) => new Date(a.service_date) - new Date(b.service_date), // Sort by date
  },
];

export const missedTaskColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    render: (row) => <span className="text-sm font-medium">{row}</span>,
    sorter: (a, b) => a.team_name.localeCompare(b.team_name), // Sort alphabetically
    width: 130,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (row) => <span className="">{row}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    sorter: (a, b) => a.number.localeCompare(b.number), // Sort alphabetically
  },
  {
    title: "Task Status",
    dataIndex: "task_status",
    key: "task_status",
    width: 130,
    render: (task_status) => {
      const getTaskStatusTagColor = (task_status) => {
        switch (task_status) {
          case 0:
            return "#F5BC00"; // Red for Pending
          case 1:
            return "#D4C3A7"; // Black for On The Way
          case 2:
            return "#5D87FF"; // Blue for Working
          case 3:
            return "#13DEB9"; // Green for Completed
          default:
            return "#d9d9d9"; // Gray for Unknown
        }
      };

      const getTaskStatusText = (task_status) => {
        switch (task_status) {
          case 0:
            return "Pending";
          case 1:
            return "On The Way";
          case 2:
            return "Working";
          case 3:
            return "Completed";
          default:
            return "Unknown";
        }
      };

      return (
        <Tag
          color={getTaskStatusTagColor(task_status)}
          style={{
            fontSize: "12px",
            padding: "2px 2px",
            borderRadius: "10px",
            textAlign: "center",
            width: "100px",
            color: "white",
          }}
        >
          {getTaskStatusText(task_status)}
        </Tag>
      );
    },
    sorter: (a, b) => a.task_status - b.task_status, // Sort numerically by status
  },

  {
    title: "Response",
    dataIndex: "response",
    key: "response",
    // render: (response) => (response === 1 ? 'YES' : 'NO'), // Conditional rendering
    render: (response) => (
      <Tag
        color={getResponseTagColor(response)}
        style={{
          fontSize: "12px",
          padding: "2px 2px",
          borderRadius: "10px",
          textAlign: "center",
          width: "100px",
          color: "white",
        }}
      >
        {response === 2 ? "NO" : response === 1 ? "YES" : "Pending"}
      </Tag>
    ),
    sorter: (a, b) => a.response - b.response, // Sort numerically (0 or 1)
    width: 120,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    width: 130,
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at), // Sort by date
  },
  {
    title: "Service Date",
    dataIndex: "service_date",
    key: "service_date",
    width: 140,
    sorter: (a, b) => new Date(a.service_date) - new Date(b.service_date), // Sort by date
  },

  {
    title: " Last Service Date",
    dataIndex: "last_service_date",
    key: "last_service_date",
    width: 180,
    sorter: (a, b) =>
      new Date(a.last_service_date) - new Date(b.last_service_date), // Sort by date
  },

  {
    title: " Upcomming Service Date",
    dataIndex: "upcoming_service_date",
    key: "upcoming_service_date",
    width: 220,
    sorter: (a, b) =>
      new Date(a.upcoming_service_date) - new Date(b.upcoming_service_date), // Sort by date
  },
];

export const liveTrackingColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    render: (row) => <span className="text-sm font-medium">{row}</span>,
    sorter: (a, b) => a.team_name.localeCompare(b.team_name), // Sort alphabetically
    width: 130,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
    render: (row) => <span>{row}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    width: 130,
    sorter: (a, b) => a.number.localeCompare(b.number), // Sort alphabetically
  },
  {
    title: "Task Status",
    dataIndex: "status", // 'status' comes from the SQL query
    key: "status",
    width: 180,
    render: (status) => {
      const getTaskStatusTagColor = (status) => {
        switch (status) {
          case 0:
            return "#F5BC00"; // Yellow for Pending
          case 1:
            return "#D4C3A7"; // Black for On The Way
          case 2:
            return "#5D87FF"; // Blue for Working
          case 3:
            return "#13DEB9"; // Green for Completed
          default:
            return "#d9d9d9"; // Gray for Unknown
        }
      };

      const getTaskStatusText = (status) => {
        switch (status) {
          case 0:
            return "Pending";
          case 1:
            return "On The Way";
          case 2:
            return "Working";
          case 3:
            return "Completed";
          default:
            return "Unknown";
        }
      };

      return (
        <Tag
          color={getTaskStatusTagColor(status)}
          style={{
            fontSize: "12px",
            padding: "2px 2px",
            borderRadius: "10px",
            textAlign: "center",
            width: "100px",
            color: "white",
          }}
        >
          {getTaskStatusText(status)}
        </Tag>
      );
    },
    sorter: (a, b) => a.status - b.status, // Sort numerically by status
  },
  {
    title: "Created At",
    dataIndex: "time_stamp", // 'time_stamp' from the SQL query
    key: "created_at",
    // width: 200,
    maxWidth: 220,
    sorter: (a, b) => new Date(a.time_stamp) - new Date(b.time_stamp), // Sort by date
  },
  {
    title: "Service Date",
    dataIndex: "service_date", // 'service_date' from the SQL query
    key: "service_date",
    // width: 200,
    maxWidth: 220,
    sorter: (a, b) => new Date(a.service_date) - new Date(b.service_date), // Sort by date
  },
];

export const feedbackColumn = [
  {
    title: "Team Name",
    dataIndex: "team_name",
    key: "team_name",
    render: (row) => <span className="text-sm font-medium">{row}</span>,
    sorter: (a, b) => a.team_name.localeCompare(b.team_name), // Sort alphabetically
    // width: 130,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (row) => <span>{row}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
    // width: 100,
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    sorter: (a, b) => a.number.localeCompare(b.number), // Sort alphabetically
    // width: 100,
  },
 
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    // width: 100,
    render: (rating) => {
      const getRatingColor = (rating) => {
        if (rating === 1)  return "#F56C6C"; // Red for poor rating
        if (rating === 2) return "#F5BC00"; // Yellow for average rating
        return "#13DEB9"; // Green for good rating
      };

      return (
        <Tag
          color={getRatingColor(rating)}
          style={{
            fontSize: "12px",
            padding: "2px 2px",
            borderRadius: "10px",
            textAlign: "center",
            width: "80px",
            color: "white",
          }}
        >
          {rating === 1 ? "Very Poor" : rating === 2 ? "Average" : "Excellent"}
        </Tag>
      );
    },
    sorter: (a, b) => a.rating - b.rating, // Sort numerically by rating
  },
  {
    title: "Service Date",
    dataIndex: "service_date",
    key: "service_date",
    width: 140,
    sorter: (a, b) => new Date(a.service_date) - new Date(b.service_date), // Sort by date
    render: (date) => {
      return new Date(date).toLocaleDateString(); // Format date
    },
  },
  {
    title: "Created At",
    dataIndex: "created_in_feedback", // Renamed as 'created_in_feedback' from the SQL query
    key: "created_in_feedback",
    width: 150,
    sorter: (a, b) =>
      new Date(a.created_in_feedback) - new Date(b.created_in_feedback), // Sort by date
    render: (date) => {
      return new Date(date).toLocaleDateString(); // Format date
    },
  },
];
