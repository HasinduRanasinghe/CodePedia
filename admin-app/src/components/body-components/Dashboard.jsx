import React from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const handleUserListClick = () => {
    navigate('/ViewUsers');
  };
  return (
    <div className="w3-main" style={{ marginLeft: "30px", marginTop: "10px" }}>
      {/* Header */}
      <header className="w3-container" style={{ paddingTop: "22px" }}>
        <h5 className="heading">Dashboard</h5>
      </header>

      <div className="w3-card-container">
        <div className="w3-card w3-orange" onClick={handleUserListClick}>
          <div className="w3-left">
            <i className="fa fa-users w3-xxxlarge"></i>
          </div>
          <div className="w3-right">
            <h3>50</h3>
          </div>
          <div className="w3-clear"></div>
          <h4>Users List</h4>
        </div>
        <div className="w3-card w3-red">
          <div className="w3-left">
            <i className="fa fa-comment w3-xxxlarge"></i>
          </div>
          <div className="w3-right">
            <h3>52</h3>
          </div>
          <div className="w3-clear"></div>
          <h4>Messages</h4>
        </div>

        <div className="w3-card w3-blue">
          <div className="w3-left">
            <i className="fa fa-eye w3-xxxlarge"></i>
          </div>
          <div className="w3-right">
            <h3>99</h3>
          </div>
          <div className="w3-clear"></div>
          <h4>Views</h4>
        </div>

        <div className="w3-card w3-teal">
          <div className="w3-left">
            <i className="fa fa-share-alt w3-xxxlarge"></i>
          </div>
          <div className="w3-right">
            <h3>23</h3>
          </div>
          <div className="w3-clear"></div>
          <h4>Shares</h4>
        </div>
      </div>

      <div className="w3-container w3-section">
        <div className="w3-row-padding" style={{ margin: "0 -16px" }}>
          <div className="w3-twothird">{/* Content for Feeds goes here */}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
