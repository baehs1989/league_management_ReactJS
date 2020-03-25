import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {Grid, Select, FormControl, InputLabel, MenuItem} from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    borderBottom:'1px solid rgba(224, 224, 224, 1)'
  },
  form : {
      width:'100%'
  }
});

export default function CenteredTabs(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
        <Grid container>
            <Grid item xs={12} sm={10}>
                <Tabs
                    value={props.selectedTab}
                    onChange={props.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab value={0} label="All"/>
                    <Tab value={1} label="Fixtures" />
                    <Tab value={2} label="Results" />
                </Tabs>
            </Grid>

            <Grid item xs={12} sm={2}>
                <FormControl className={classes.form}>
                    <InputLabel shrink id="team-filter">
                        Filter By Team
                    </InputLabel>
                    <Select
                    labelId="team-filter"
                    value={props.selectedFilter}
                    onChange={props.handleFilterChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {props.teams.map(team => {
                            return <MenuItem key={team.id} value={team.id}>{team.teamName}</MenuItem>
                        })}
                        {/* <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </Paper>
  );
}
