import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Grid from '@material-ui/core/Grid';

import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  }
}));

export default function PrimarySearchAppBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between">
            <Grid item container justify="center" xs={12} sm={2} alignContent="center">
              <Typography variant="h6" noWrap>
                Players
              </Typography>
            </Grid>
            <Grid item container justify="flex-end" alignItems="center" xs={12} sm={5}>
              <Grid item xs={11} sm={8}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    value={props.search}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={props.handleOnSearchChange}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
              </Grid>
              
              {props.admin?
                <Grid item xs={1}>
                  <div className={classes.grow} />
                  <div>
                    <IconButton onClick={props.handleDialogOpen} color="inherit">
                        <PersonAddIcon />
                    </IconButton>
                  </div>              
                </Grid>
                :
                null
              }

              
              <Grid item container justify="flex-end" xs={12}>
                <FormControl>
                  <InputLabel style={{color:'white'}} shrink htmlFor="age-native-label-placeholder">
                    Team
                  </InputLabel>
                  <NativeSelect
                    value={props.selectedTeam}
                    onChange={props.handleSelectTeamChange}
                    style={{color:'white'}}
                    inputProps={{
                      name: 'team',
                      id: 'age-native-label-placeholder',
                    }}
                  >
                    <option value="">All</option>
                    {props.teams.map(team => {
                      return <option key={team.id} value={team.id}>{team.teamName}</option>
                    })}
                  </NativeSelect>
                </FormControl>
              </Grid>






            </Grid>
            
          
          </Grid>          






        </Toolbar>
      </AppBar>
    </div>
  );
}
