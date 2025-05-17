import React from 'react';

function UserNavbar() {
  return (
      <nav className="navbar navbar-expand navbar-dark mb-4" style={{ backgroundColor: '#1f232b' }}>
          <div className="container-fluid">
              <a className="navbar-brand" href="/userpage">BeHealthy</a>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
                  <li className="nav-item"><a className="nav-link active" href="/userpage">Home</a></li>
                  <li className="nav-item"><a className="nav-link" href="/userprofile">Profile</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Posts</a></li>
                  <li className="nav-item"><a className="nav-link" href="/dietitianslist">Dietitians</a></li>
              </ul>
          </div>
      </nav>
  );
}

export default UserNavbar;