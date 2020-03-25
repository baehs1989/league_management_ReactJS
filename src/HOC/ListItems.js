import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import EventIcon from '@material-ui/icons/Event';
import FlagIcon from '@material-ui/icons/Flag';

import {Link} from 'react-router-dom'

const styles = {
  Link : {
    color:'inherit',
    textDecoration:'none'
  }
}

class ListItems extends Component {
  state = {
    selected:'/'
  }

  componentDidMount(){
    this.setState({selected:window.location.pathname})
  }

  onClickSelected = (index) => {

    this.setState({selected:index})
  }

  render(){
    return (
      <div>
      <Link style={styles.Link} to="/">
        <ListItem 
          button
          selected={this.state.selected === '/'}
          onClick={() => this.onClickSelected('/')}
        >
          <ListItemIcon>
            <SportsSoccerIcon />
          </ListItemIcon>
          <ListItemText primary="League" />
        </ListItem>
      </Link>
  
      <Link style={styles.Link} to="/teams">
        <ListItem 
          button
          selected={this.state.selected === '/teams'}
          onClick={() => this.onClickSelected('/teams')}
        >
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText primary="Teams" />
        </ListItem>
      </Link>
  
      <Link style={styles.Link} to="/players">
        <ListItem 
          button
          selected={this.state.selected === '/players'}
          onClick={() => this.onClickSelected('/players')}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Players" />
        </ListItem>
      </Link>
  
      <Link style={styles.Link} to="/schedule">
        <ListItem 
          button
          selected={this.state.selected === '/schedule'}
          onClick={() => this.onClickSelected('/schedule')}
        >
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Schedule" />
        </ListItem>
      </Link>
      
      <Link style={styles.Link} to="/myteam">
        <ListItem
          button
          selected={this.state.selected === '/myteam'}
          onClick={() => this.onClickSelected('/myteam')}
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="My Team" />
        </ListItem>
      </Link>
    </div>
    )
  }
}

export default ListItems