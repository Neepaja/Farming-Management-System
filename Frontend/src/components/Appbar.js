// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AppBar.css'; 

// function AppBar() {
//   const [userDetails, setUserDetails] = useState(null);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/userdetail', {
//           withCredentials: true
//         });
//         setUserDetails(response.data.userDetails);
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   return (
//     <div className="appbar">
//       <div className="user-details">
//         {userDetails && (
//           <>
//           <span>{userDetails.firstName} {userDetails.lastName}</span>
//           <div className="email">{userDetails.email}</div>
//         </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AppBar;

// AppBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppBar.css';
import Logo from './LOGO.png'; // Import your logo image

function AppBar({ isMinimized }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/userdetail', {
          withCredentials: true
        });
        setUserDetails(response.data.userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className={`appbar ${isMinimized ? 'minimized' : ''}`}>
      <div className={`alogo ${isMinimized ? 'minimized' : ''}`}>
      <img src={Logo} alt="Logo" style={{ width: '60px', height: '60px' }} />
      <span>ASMP</span>
      </div>
      <div className="user-details">
        {userDetails && (
          <>
            <span className="user-name">{userDetails.firstName} {userDetails.lastName}</span>
            <div className="user-email">{userDetails.email}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default AppBar;
