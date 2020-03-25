import React, { Component} from "react";
import {Container, Paper} from '@material-ui/core'
import Tabs from './Tabs'
import DaySlot from './DaySlot'
import AppBar from './AppBar'
import Dialog from './Dialog'
import {db} from '../../Firebase'

import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';

import classes from './SchedulePage.module.css'

class SchedulePage extends Component {
    _isMounted = false

    state ={
        selectedTab : 0,
        selectedFilter: "",
        teams : [],
        ogMatches:[],
        matches: [],
        dialog: false,
        updating: false,
        selectedMatch: {}
    }

    sortDate = (match1, match2) => {
        if (match1.date > match2.date) return -1
        if (match1.date < match2.date) return 1
    }

    componentDidMount(){
        this._isMounted = true
        db.collection('match').orderBy('date').onSnapshot(snapshot => {
            const allMatch = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    id:doc.id,
                    ...doc.data()
                }
            })

            // allMatch.sort(this.sortDate)
            if (this._isMounted){
                this.setState({ogMatches:allMatch})
            }
            

            // console.log(allMatch)
            // var temp = {}
            // allMatch.forEach(match => {
            //     if (match.date in temp){
            //         temp[match.date].push(match)
            //     }else{
            //         temp[match.date] = [match]
            //     }
            // })

            // var result = []

            // Object.keys(temp).forEach(day => {
            //     result.push({
            //         [day] : temp[day]
            //     })
            // })

            // this.setState({matches:result})
            

        })



        db.collection('team').onSnapshot(snapshot => {
            const allTeam = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    id:doc.id,
                    teamName:doc.data().teamName,
                }
            })

            if (this._isMounted){
                this.setState({teams:allTeam})
            }
            
        })



    }

    componentWillUnmount(){
        this._isMounted = false
    }


    handleDialogClose = () => {
        this.setState({dialog:false, updating:false})
    }

    handleDialogOpen = () => {
        this.setState({dialog:true})
    }

    handleUpdateButtonClick = (game) => {
        // console.log(game)
        this.setState({dialog:true, updating:true, selectedMatch:game})
    }

    handleTabChange = (event, value) => {
        this.setState({selectedTab:value})
    }

    handleFilterChange = (event) =>{
        this.setState({selectedFilter:event.target.value})
    }

    orderTime = (match1, match2) =>{
        if (match1.time > match2.time) return 1
        if (match1.time < match2.time) return -1

        if (match1.place < match2.place) return -1
        if (match1.place > match2.place) return 1
    }

    dataNormalize = (allMatch) => {
        var temp = {}
        allMatch.forEach(match => {
            if (match.date in temp){
                temp[match.date].push(match)
                temp[match.date].sort(this.orderTime)
            }else{
                temp[match.date] = [match]
            }
        })

        var result = []

        Object.keys(temp).forEach(day => {
            result.push({
                [day] : temp[day]
            })
        })

        return result
    }

    render(){
        // console.log(this.state.ogMatches)
        // console.log(this.state)

        var filtered = []
        
        this.state.ogMatches.forEach(match => {
            let id = match.hometeamID+match.awayteamID
            if (this.state.selectedTab===0){
                if (id.includes(this.state.selectedFilter)){
                    filtered.push(match)
                }
            }
            else if(this.state.selectedTab===1){      
                if (id.includes(this.state.selectedFilter) && !match.played){
                    filtered.push(match)
                }
            }else{
                if (id.includes(this.state.selectedFilter) && match.played){
                    filtered.push(match)
                }
            }
        })

        var matches = this.dataNormalize(filtered)

        if (this.state.selectedTab === 2){
            matches.reverse()
        }


        return (
            <Container component="main" maxWidth={false}>
                <Paper elevation={1}>
                    <AppBar openDialog={this.handleDialogOpen} admin={this.props.admin}/>
                    <Tabs handleTabChange={this.handleTabChange} selectedTab={this.state.selectedTab} selectedFilter={this.state.selectedFilter} teams={this.state.teams} handleFilterChange={this.handleFilterChange}/>
                    {matches.map((match,index) => {
                        return <DaySlot key={"Week"+index} match={match} handleUpdateButtonClick={this.handleUpdateButtonClick} handleDialogOpen={this.handleDialogOpen} admin={this.props.admin}/>
                    })}
                </Paper>
                <Dialog 
                    open={this.state.dialog}
                    onClose={this.handleDialogClose}
                    teams={this.state.teams}
                    updating={this.state.updating}
                    selectedMatch={this.state.selectedMatch}
                />

                <IconButton color="inherit" className={classes.FixedButton} onClick={this.handleDialogOpen}>
                    <AddBoxIcon style={{fontSize:'3.5rem'}}/>
                </IconButton>

            </Container>
        )
    }
}

export default SchedulePage;