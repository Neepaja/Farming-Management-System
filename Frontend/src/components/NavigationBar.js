import React, { useState, useEffect, useMemo } from 'react';
import { GrMenu } from 'react-icons/gr';
import { FaHome, FaUser, FaTruck, FaClipboardList, FaChartBar, FaRibbon, FaBox, FaFileAlt, FaCog, FaSignOutAlt, FaBoxOpen, FaClipboard } from 'react-icons/fa';
import './NavigationBar.css';
import { FaUserShield } from 'react-icons/fa';
import { getUserRole } from '../services/Api';

function NavigationBar({ isMinimized, setIsMinimized }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [userRole, setUserRole] = useState(null); // State to store user role

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prevState => ({
      ...prevState,
      [menuId]: !prevState[menuId]
    }));
  };
  const handleLogout = () => {
    // Remove the 'token' cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to the login page
    window.location.href = '/login'; // Adjust the URL as needed
  };
  const handlePageSelection = (pageId, hasSubPages) => {
    setCurrentPage(pageId);
    if (!hasSubPages) {
      setExpandedMenus({});
    }
  };

  const pages = useMemo(() => {
    switch (userRole) {
      case 'Admin':
        return [
          { id: 'dashboard', name: 'Dashboard', icon: <FaHome size={isMinimized ? 19 : 20} />, route: '/dashboard' },
          { id: 'manageFarmer', name: 'Manage Farmer', icon: <FaUser size={isMinimized ? 19 : 20} />, route: '/manage-farmer' },
          { id: 'supplies', name: 'Supplies', icon: <FaTruck size={isMinimized ? 19 : 20} />, route: '/dashboard', subPages: [
            { id: 'item', name: 'Item', icon: <FaBoxOpen size={isMinimized ? 16 : 18} />, route: '/items' },
            { id: 'supply', name: 'Supply', icon: <FaClipboard size={isMinimized ? 16 : 18} />, route: '/supplies' }
          ] },
          { id: 'statusAnalysis', name: 'Status Analysis', icon: <FaChartBar size={isMinimized ? 19 : 20} />, route: '/status' },
          { id: 'ribbonCount', name: 'Ribbon Count', icon: <FaRibbon size={isMinimized ? 19 : 20} />, route: '/ribbonCount' },
          { id: 'manageProducts', name: 'Manage Products', icon: <FaBox size={isMinimized ? 19 : 20} />, route: '/dashboard', subPages: [
            { id: 'product', name: 'Product', icon: <FaBoxOpen size={isMinimized ? 16 : 18} />, route: '/products' },
            { id: 'collection', name: 'Collection', icon: <FaClipboard size={isMinimized ? 16 : 18} />, route: '/collections' }
          ] },
          { id: 'generateReport', name: 'Generate Report', icon: <FaFileAlt size={isMinimized ? 19 : 20} />, route: '/income-expenses' },
          { id: 'settings', name: 'Settings', icon: <FaCog size={isMinimized ? 19 : 20} />, route: '/adduser' }
        ];
      case 'CC':
        return [
          { id: 'dashboard', name: 'Dashboard', icon: <FaHome size={isMinimized ? 19 : 20} />, route: '/dashboard' },
          { id: 'manageFarmer', name: 'Manage Farmer', icon: <FaUser size={isMinimized ? 19 : 20} />, route: '/manage-farmer' }
        ];
      case 'SK':
        return [
          { id: 'supplies', name: 'Supplies', icon: <FaTruck size={isMinimized ? 19 : 20} />, route: '/dashboard', subPages: [
            { id: 'item', name: 'Item', icon: <FaBoxOpen size={isMinimized ? 16 : 18} />, route: '/items' },
            { id: 'supply', name: 'Supply', icon: <FaClipboard size={isMinimized ? 16 : 18} />, route: '/supplies' }
          ] },
        ];
      case 'Supervisor':
        return [
          { id: 'status-entry', name: 'Status Entry', icon: <FaHome size={isMinimized ? 19 : 20} />, route: '/status-entry' }
        ];
      case 'FDO':
        return [
          { id: 'manageProducts', name: 'Manage Products', icon: <FaBox size={isMinimized ? 19 : 20} />, route: '/dashboard', subPages: [
            { id: 'product', name: 'Product', icon: <FaBoxOpen size={isMinimized ? 16 : 18} />, route: '/products' },
            { id: 'collection', name: 'Collection', icon: <FaClipboard size={isMinimized ? 16 : 18} />, route: '/collections' }
          ] }
        ];
      default:
        return [];
    }
  }, [isMinimized, userRole]);

  useEffect(() => {
    // Fetch user role when the component mounts
    const fetchUserRole = async () => {
      try {
        const userData = await getUserRole();
        console.log("User Data",userData);
        console.log("User role",userData.role);
        setUserRole(userData.role);
        console.log("User Role : ",userRole)
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []); 

  useEffect(() => {
    const path = window.location.pathname;
    const page = pages.find(p => p.route === path);
    if (page) {
      setCurrentPage(page.id);
    } else {
      pages.forEach(p => {
        if (p.subPages) {
          const subPage = p.subPages.find(sp => sp.route === path);
          if (subPage) {
            setCurrentPage(subPage.id);
          }
        }
      });
    }
  }, [pages]);

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="toggle-btn" onClick={() => setIsMinimized(!isMinimized)}>
        <GrMenu className="menu-icon" />
      </div>
      <div className="logo">
        {isMinimized ? <FaUserShield className="icon" /> : <><FaUserShield className="icon" /> {userRole} </>}
      </div>
      <ul className="nav-links">
        {pages.map(page => (
          <li key={page.id} className={currentPage === page.id ? 'current-page' : ''}>
            <a href={page.route} onClick={(e) => {
              if (page.subPages) {
                e.preventDefault();
                toggleSubMenu(page.id);
              } else {
                handlePageSelection(page.id, false);
              }
            }}>
              {page.icon} {!isMinimized && page.name}
            </a>
            {page.subPages && !isMinimized && (
              <ul className={`sub-menu ${expandedMenus[page.id] ? 'expanded' : 'collapsed'}`}>
                {page.subPages.map(subPage => (
                  <li key={subPage.id} className={currentPage === subPage.id ? 'current-page' : ''}>
                    <a href={subPage.route} onClick={() => handlePageSelection(subPage.id, true)}>
                      {subPage.icon} {subPage.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
        ))}
        <li>
          <a href="#" onClick={handleLogout}>
            <FaSignOutAlt /> {!isMinimized && 'Logout'}
          </a>
        </li>
      </ul>
    </div>
  );
}

export default NavigationBar;
