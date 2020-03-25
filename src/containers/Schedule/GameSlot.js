import React, { Component} from "react";
import {Grid,IconButton} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import PlaceIcon from '@material-ui/icons/Place';
import cssClasses from './GameSlot.module.css'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

const styles = theme => ({
    root:{
        padding: theme.spacing(1),
        borderBottom : 'solid 0.5px rgba(224, 224, 224, 1)',
        margin:0
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
    state = {
    }

    render(){
        const {classes, game} = this.props

        var played = game.played
        var time_result;
        if (played) {
            time_result = <div className={classes.gameresult}><div className={classes.score}>{game.homescore}</div><div className={classes.score}>{game.awayscore}</div></div>
        }else{
            time_result = <div className={classes.gametime}>{game.time}</div>
        }

        return (
            <React.Fragment>

                {/* desktop view */}
                <Grid container spacing={1} className={classes.root + " " + cssClasses.Desktop} justify="space-between">

                    <Grid item xs={5} md={5} >
                        <table style={{width:'100%'}}> 
                            <tbody>
                                <tr>
                                    <td style={{width:"33%"}}><span className={classes.hometeam}>{game.hometeam}</span></td>
                                    <td style={{width:"33%"}}> {time_result}</td>
                                    <td style={{width:"33%"}}><span className={game.awayteam}>{game.awayteam}</span></td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <span className={classes.hometeam}>{game.hometeam}</span> {time_result} <span className={game.awayteam}>{game.awayteam}</span> */}
                    </Grid>
                    <Grid style={{position:'relative'}} item xs={4} md={4}>
                        {/* <table>
                            <tbody>
                                <tr>
                                    <td><span className={classes.stadiumname}><PlaceIcon style={{fontSize:'inherit'}}/> {game.place}</span></td>
                                </tr>
                            </tbody>
                        </table> */}


                        <div className={classes.stadiumname}><PlaceIcon style={{fontSize:'inherit'}}/> {game.place}</div>
                    </Grid>
                    {this.props.admin?
                        <Grid style={{display:'flex'}} item xs={1} md={1}>
                            <IconButton onClick={() => this.props.handleUpdateButtonClick(game)}>
                                <OpenInNewIcon/>
                            </IconButton>
                        </Grid>    
                        :
                        null                
                    }

                </Grid>

                {/* mobile view */}
                <Grid container spacing={1} className={classes.root + " " + cssClasses.Mobile}>
                    {/* {played?
                            null
                        :
                            <Grid style={{position:'relative'}} item xs={12}>
                                <div><WatchLaterIcon style={{fontSize:'inherit'}}/> {game.time}</div>
                                <div className={played?classes.stadiumname:""}><PlaceIcon style={{fontSize:'inherit'}}/> {game.place}</div>
                            </Grid>
                    } */}

                    <Grid item xs={12}>
                        <table className={cssClasses.Table} style={{width:'100%'}}> 
                            <tbody>
                                <tr>
                                    <td className={cssClasses.Team}>{game.hometeam}</td>
                                    {played?
                                        <td className={cssClasses.Score}>{game.homescore}</td>
                                    :
                                        null
                                    }
                                </tr>
                                <tr>
                                    <td className={cssClasses.Team}>{game.awayteam}</td>
                                    {played?
                                        <td className={cssClasses.Score}>{game.awayscore}</td>
                                    :
                                        null
                                    }
                                </tr>
                            </tbody>
                        </table>
                        {/* <span className={classes.hometeam}>{game.hometeam}</span> {time_result} <span className={game.awayteam}>{game.awayteam}</span> */}
                        {true?
                            <Grid style={{position:'relative', padding:'0.5rem'}} item xs={12}>
                                <div style={{padding:'0.5rem'}}><WatchLaterIcon style={{fontSize:'inherit',verticalAlign: "middle"}}/> {game.time}</div>
                                <div style={{padding:'0.5rem'}}><PlaceIcon style={{fontSize:'inherit',verticalAlign: "middle"}}/>{game.place}</div>
                            </Grid>
                            :
                            null         
                        }
                    </Grid>
                    {this.props.admin?
                        <Grid item xs={12}>
                            <IconButton style={{padding:'0'}}onClick={() => this.props.handleUpdateButtonClick(game)}>
                                <OpenInNewIcon/>
                            </IconButton>
                        </Grid>
                        :
                        null
                    }


                </Grid>


            </React.Fragment>
        )
    }
}

export default withStyles(styles)(GameSlot);