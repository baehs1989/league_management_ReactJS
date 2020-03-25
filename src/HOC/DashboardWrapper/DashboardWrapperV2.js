import React from 'react';
import classes from './DashboardWrapperV2.module.css'
import {Link} from 'react-router-dom'

import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EventIcon from '@material-ui/icons/Event';
import FlagIcon from '@material-ui/icons/Flag';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from "react-router-dom";





export default function DashboardWrapperV2(props) {
  let history = useHistory();
  var location = history.location.pathname

  const logOutUser = () => {
    props.onLogout()
  };

  return (
    <React.Fragment>
      <nav className={classes.NavBar}>
        <ul className={classes.NavBar_Nav}>

          <li className={classes.Logo}>
            <Link to="/" className={classes.NavLink}>
              <span className={classes.LinkText + " " + classes.LogoText}>HELLO!</span>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fad"
                data-icon="angle-double-right"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="svg-inline--fa fa-angle-double-right fa-w-14 fa-5x"
              >
                <g className="fa-group">
                  <path
                    fill="currentColor"
                    d="M224 273L88.37 409a23.78 23.78 0 0 1-33.8 0L32 386.36a23.94 23.94 0 0 1 0-33.89l96.13-96.37L32 159.73a23.94 23.94 0 0 1 0-33.89l22.44-22.79a23.78 23.78 0 0 1 33.8 0L223.88 239a23.94 23.94 0 0 1 .1 34z"
                    className="fa-secondary"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M415.89 273L280.34 409a23.77 23.77 0 0 1-33.79 0L224 386.26a23.94 23.94 0 0 1 0-33.89L320.11 256l-96-96.47a23.94 23.94 0 0 1 0-33.89l22.52-22.59a23.77 23.77 0 0 1 33.79 0L416 239a24 24 0 0 1-.11 34z"
                    className="fa-primary"
                  ></path>
                </g>
              </svg>
            </Link>
          </li>


          <li className={classes.NavItem} >
            <Link to="/" className={location==="/"?classes.Selected:classes.NavLink}>
              <SportsSoccerIcon/>
              <span className={classes.LinkText}>League</span>
            </Link>
          </li>

          <li className={classes.NavItem}>
            <Link to="/teams" className={location==="/teams"?classes.Selected:classes.NavLink}>
              <FlagIcon/>
              <span className={classes.LinkText}>Teams</span>
            </Link>
          </li>


          <li className={classes.NavItem}>
            <Link to="/players" className={location==="/players"?classes.Selected:classes.NavLink}>
              <PeopleIcon/>
              <span className={classes.LinkText}>Players</span>
            </Link>
          </li>



          <li className={classes.NavItem}>
            <Link to="/schedule" className={location==="/schedule"?classes.Selected:classes.NavLink}>
              <EventIcon />
              <span className={classes.LinkText}>Schedule</span>
            </Link>
          </li>

          {props.admin?
            <li className={classes.NavItem}>
            <Link to="/config" className={location==="/config"?classes.Selected:classes.NavLink}>
              <SettingsIcon />
              <span className={classes.LinkText}>Configuration</span>
            </Link>
          </li>
            :
            <li className={classes.NavItem}>
              <Link to="/myteam" className={location==="/myteam"?classes.Selected:classes.NavLink}>
                <AssignmentIcon />
                <span className={classes.LinkText}>My Team</span>
              </Link>
            </li>
          }


          {props.authenticated?
            <li className={classes.NavItem}>
              <span style={{cursor:'pointer'}} onClick={logOutUser} className={classes.NavLink}>
                <ExitToAppIcon />
                <span className={classes.LinkText}>Log Out</span>
              </span>
            </li>
            :
            null
          }


        <li className={classes.CopyRight}>
          <span className={classes.LinkText}>          
            Version 1.0.0
            <br/>
            © Copyright AB 2019. All rights reserved.
          </span>
        </li>

        </ul>
        
      </nav>

      <main className={classes.Main}>
        {props.children}
      </main>
    </React.Fragment>
  );
}