import React, { Component} from "react";
import {Grid,} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import PlaceIcon from '@material-ui/icons/Place';
import cssClasses from './GameSlot.module.css'
import WatchLaterIcon from '@material-ui/icons/WatchLater';

const styles = theme => ({
    root:{
        borderBottom : 'solid 0.5px rgba(224, 224, 224, 1)',
        margin:0,
    },
    hometeam:{
        padding: theme.spacing(1)
    },
    awayteam:{
        padding: theme.spacing(1)
    },
    gametime:{
        border: '1px solid rgba(224, 224, 224, 1)',
        padding: theme.spacing(1),
    },
    gameresult:{
        padding: theme.spacing(1),
        display: 'inline-flex'
    },
    score:{
        padding: theme.spacing(1),
        margin: '0.5px',
        backgroundColor:'rgb(36,36,36)',
        color:'white',
        width: '40px'
    },
    stadiumname:{
        padding: theme.spacing(1),
        position:'absolute',
        top:'50%',
        left:'50%',
        transform : "translate(-50%, -50%)",
        width: '100%'
    }
    
})

class GameSlot extends Component {
    
    render(){
        var {classes, match} = this.props
        return (
            <div>
                <Grid container spacing={1} className={classes.root}>
                    <Grid item xs={12}>
                        <table className={cssClasses.Table} style={{width:'100%'}}> 
                            <tbody>
                                <tr>
                                    <td className={cssClasses.Team}>{match.hometeam}</td>
                                </tr>
                                <tr>
                                    <td className={cssClasses.Team}>{match.awayteam}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Grid>

                    <Grid style={{position:'relative'}} item xs={12}>
                        <div className={cssClasses.INFO}>{match.date}</div>
                        <div className={cssClasses.INFO}><WatchLaterIcon style={{fontSize:'inherit'}}/> {match.time}</div>
                        <div className={cssClasses.INFO}><PlaceIcon style={{fontSize:'inherit'}}/> {match.place}</div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(GameSlot);