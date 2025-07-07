import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router';

const Header = () => {
  const location = useLocation();

  // Map your routes to breadcrumb names
  const breadcrumbNameMap = {
    '/': 'Clients',
    '/clients': 'Clients',
    '/region': 'Region',
    '/worker': 'Worker',
    '/team': 'Team',
    '/tasks': 'Tasks',
    '/users': 'Users',
    '/upcoming-tasks': 'Upcoming Task',
    '/missed-tasks': 'Missed Task',
  };

  // Generate breadcrumb items dynamically based on the current path
  const pathSnippets = location.pathname.split('/').filter((i) => i); // Split the path by '/' and remove empty parts
  const breadcrumbItems = [
    {
      title: <a href="#">Home</a>, // Add your "Home" breadcrumb
      key: 'home',
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return {
        title: breadcrumbNameMap[url] || url.replace('/', ''),
        key: url,
      };
    }),
  ];

  return (
    <div className="bg-[#ECF2FF] mt-5 p-3 rounded-lg flex items-center justify-between">
      <div>
        {/* Header Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          {breadcrumbNameMap[location.pathname] || 'Page'}
        </h1>

        {/* Breadcrumb Navigation */}
        <Breadcrumb
          className="mt-2 text-gray-500 font-medium font-jakarta"
          items={breadcrumbItems}
        />
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0">
        <img
          src="https://modernize-react.adminmart.com/assets/ChatBc-CQ5hWW4s.png"
          alt="Header"
          style={{ height: '100px', width: '100px' }}
        />
      </div>
    </div>
  );
};

export default Header;
