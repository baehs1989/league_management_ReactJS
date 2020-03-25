import React, { Component} from "react";
import { Paper} from '@material-ui/core'
import classes from './ScoreRanking.module.css'
import { StickyTable, Row, Cell } from 'react-sticky-table';
import {db} from '../../../Firebase'

class ScoreRanking extends Component {
    _isMounted = false
    state = {
        players : []
    }

    rankingLogic = (p1, p2) => {
        if (p1.goals > p2.goals) return -1
        if (p1.goals < p2.goals) return 1
    }

    componentDidMount(){
        this._isMounted = true
        db.collection('player').where('shown','==',true).limit(10).onSnapshot(snapshot => {
            const players = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    lastName:doc.data().lastName,
                    firstName:doc.data().firstName,
                    teamName:doc.data().team,
                    goals:doc.data().goal
                }
            })
            if (this._isMounted){
                players.sort(this.rankingLogic)
                this.setState({players:players})
            }
            
        })        
    }

    componentWillUnmount(){
        this._isMounted = false
    }

    render(){

        let rank = 0;
        var tablecontent = this.state.players.map((player, index) => {
            if (index === 0) {
                rank = rank + 1
                return (
                    <Row key={"player__"+index}>
                        <Cell className={classes.Join}>{rank}</Cell>
                        <Cell className={classes.Left}>{player.lastName} {player.firstName}</Cell>
                        <Cell>{player.goals}</Cell>
                        <Cell>{player.teamName}</Cell>
                    </Row>
                )
            }

            if (player.goals === this.state.players[index-1].goals){
                return (
                    <Row key={"player__"+index}>
                        <Cell className={classes.Join}>{rank}</Cell>
                        <Cell className={classes.Left}>{player.lastName} {player.firstName}</Cell>
                        <Cell>{player.goals}</Cell>
                        <Cell>{player.teamName}</Cell>
                    </Row>
                )
            }

            rank = rank + 1
            return (
                <Row key={"player__"+index}>
                    <Cell className={classes.Join}>{rank}</Cell>
                    <Cell className={classes.Left}>{player.lastName} {player.firstName}</Cell>
                    <Cell>{player.goals}</Cell>
                    <Cell>{player.teamName}</Cell>
                </Row>
            )

        })
        

        return (
            <Paper>
                <div style={{width: '100%'}}>
                    <div className={classes.Title}>Top Scorers</div>
                    <StickyTable leftStickyColumnCount={2} className={classes.Table}>
                        <Row>
                            <Cell className={classes.Join}>Player</Cell>
                            <Cell></Cell>
                            <Cell>Goals</Cell>
                            <Cell>Team</Cell>
                        </Row>
                        {tablecontent}
                    </StickyTable>
                </div>
            </Paper>

        )
    }
}

export default ScoreRanking;