import React, { Component} from "react";
import { Paper} from '@material-ui/core'
import classes from './RankingTable.module.css'
import { StickyTable, Row, Cell } from 'react-sticky-table';

import {db} from '../../../Firebase'

function RecordIcon(initial, index) {
    switch(initial){
        case('L'):
            // return <FiberManualRecordIcon style={{color:'red'}} key={'record_'+index}/>
            return <div key={'record_'+index} style={{backgroundColor:'red'}} className={classes.Circle}>L</div>
        case('W'):
            // return <FiberManualRecordIcon style={{color:'green'}} key={'record_'+index}/>
            return <div key={'record_'+index} style={{backgroundColor:'green'}} className={classes.Circle}>W</div>
        case('D'):
            // return <FiberManualRecordIcon style={{color:'grey'}} key={'record_'+index}/>
            return <div  key={'record_'+index}style={{backgroundColor:'grey'}} className={classes.Circle}>D</div>
        default:
            return
    }
}

class RankingTable extends Component {
    _isMounted = false

    state = {
        teams : []
    }

    returnRank = (team1, team2) => {
        if (team1.points > team2.points) return -1
        if (team1.points < team2.points) return 1

        if (team1.goalFor-team1.goalAgainst > team2.goalFor-team2.goalAgainst) return -1
        if (team1.goalFor-team1.goalAgainst < team2.goalFor-team2.goalAgainst) return 1

        if (team1.red+team1.yellow*0.5 > team2.red+team2.yellow*0.5) return -1
        if (team1.red+team1.yellow*0.5 < team2.red+team2.yellow*0.5) return 1
    }

    componentDidMount(){
        this._isMounted = true
        db.collection('team').where('shown','==',true).onSnapshot(snapshot => {
            const allTeam = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    teamName: doc.data().teamName,
                    played : doc.data().won + doc.data().lost + doc.data().drawn,
                    won : doc.data().won,
                    drawn : doc.data().drawn,
                    lost: doc.data().lost,
                    goalFor: doc.data().goalf,
                    goalAgainst: doc.data().goala,
                    points : doc.data().point,
                    last5: doc.data().last5
                }
            })

            allTeam.sort(this.returnRank)
            if (this._isMounted){
                this.setState({teams:allTeam})
            }
            
        })

    }

    componentWillUnmount(){
        this._isMounted = false
    }



    render(){
        var tablecontent = this.state.teams.map((team, index) => {
            let lastgames = team.last5.split('').map((result, index) => {
                return RecordIcon(result, index)
            })

            return (
                <Row key={team.teamName}>
                    <Cell className={classes.Join} id="position">{index+1}</Cell>
                    <Cell className={classes.Left} id="club">{team.teamName}</Cell>
                    <Cell id="mp">{team.played}</Cell>
                    <Cell id="win">{team.won}</Cell>
                    <Cell id="draw">{team.drawn}</Cell>
                    <Cell id="lose">{team.lost}</Cell>
                    <Cell id="goalf">{team.goalFor}</Cell>
                    <Cell id="goala">{team.goalAgainst}</Cell>
                    <Cell id="goald">{team.goalFor - team.goalAgainst}</Cell>
                    <Cell id="pts">{team.points}</Cell>
                    <Cell id="last3">
                            {lastgames}
                    </Cell>
                </Row>
            )
        })

        return (
            <Paper>
                <div style={{width: '100%'}}>
                    <div className={classes.Title}>League Table</div>
                    <StickyTable leftStickyColumnCount={2} className={classes.Table}>
                        <Row className={classes.Header}>
                            <Cell className={classes.Join}>Club</Cell>
                            <Cell></Cell>
                            <Cell>MP</Cell>
                            <Cell>W</Cell>
                            <Cell>D</Cell>
                            <Cell>L</Cell>
                            <Cell>GF</Cell>
                            <Cell>GA</Cell>
                            <Cell>GD</Cell>
                            <Cell>Pts</Cell>
                            <Cell>Last 5</Cell>
                        </Row>
                        {tablecontent}
                    </StickyTable>
                </div>
            </Paper>

        )
    }
}

export default RankingTable;