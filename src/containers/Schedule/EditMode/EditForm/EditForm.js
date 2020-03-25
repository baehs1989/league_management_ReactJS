import React, { Component} from "react";
import { Button, TextField, Grid, Container, FormControlLabel, Checkbox, IconButton} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';

import cssClasses from './EditForm.module.css'

import {db} from '../../../../Firebase'

const styles = theme => ({
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxHeight: '65vh'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
})

class EditForm extends Component {
    state = {
        date:'2020-01-02',
        time:'12:00',
        hometeam:'',
        hometeamID:'',
        awayteam:'',
        awayteamID:'',
        homescore:"",
        awayscore:"",

        hometeamyellow:[],
        hometeamyellowplayer:'',
        hometeamyellownumber:'',
        
        hometeamred:[],
        hometeamredplayer:'',
        hometeamrednumber:'',

        hometeamscorers:[],
        hometeamscorer:'',
        homescorergoal:"",


        awayteamyellow:[],
        awayteamyellowplayer:'',
        awayteamyellownumber:'',
        
        awayteamred:[],
        awayteamredplayer:'',
        awayteamrednumber:'',

        awayteamscorers:[],
        awayteamscorer:'',
        awayscorergoal:"",

        place:'',
        played:false,
        isNonLeague:false,

        homeplayers:[],
        awayplayers:[],

        updating:false

    }

    sortLogic = (game1, game2) => {
        if (game1.date > game2.date) return -1
        if (game1.date < game2.date) return 1

        if (game1.time > game2.time) return -1
        if (game1.time < game2.time) return 1
    }


    componentDidMount(){
        if (this.props.updating){
            // console.log(this.props.teams)
            let newState = JSON.parse(JSON.stringify(this.props.selectedMatch))
            // console.log(this.props.selectedMatch)
            newState.awayteamscorers = JSON.parse(this.props.selectedMatch.awayteamscorers)
            newState.awayteamyellow = JSON.parse(this.props.selectedMatch.awayteamyellow)
            newState.awayteamred = JSON.parse(this.props.selectedMatch.awayteamred)

            newState.hometeamscorers = JSON.parse(this.props.selectedMatch.hometeamscorers)
            newState.hometeamyellow = JSON.parse(this.props.selectedMatch.hometeamyellow)
            newState.hometeamred = JSON.parse(this.props.selectedMatch.hometeamred)

            var query = db.collection('player').where('teamID', "==", newState.hometeamID)
            
            query.get().then(function(querySnapshot){
                let players = querySnapshot.docs.map(doc=>{
                    return{
                        id:doc.id,
                        ...doc.data()
                    }
                })

                this.setState({
                    ...newState,
                    homeplayers:players,
                    updating:this.props.updating
                })

            }.bind(this))


            query = db.collection('player').where('teamID', "==", newState.awayteamID)
            
            query.get().then(function(querySnapshot){
                let players = querySnapshot.docs.map(doc=>{
                    return{
                        id:doc.id,
                        ...doc.data()
                    }
                })

                this.setState({
                    ...newState,
                    awayplayers:players
                })

            }.bind(this))



        }
        
    }

    resetMatches = async(teamID) => {

        var homegames = await db.collection('match').where('hometeamID', '==', teamID).where('played', '==', true).get().then(function(querySnapshot){
            let result = []
            querySnapshot.forEach(function(doc){
                result.push({
                    ...doc.data()
                })
            })
            return result
        })

        var awaygames = await db.collection('match').where('awayteamID', '==', teamID).where('played', '==', true).get().then(function(querySnapshot){
            let result = []
            querySnapshot.forEach(function(doc){
                result.push({
                    ...doc.data()
                })
            })
            return result
        })



        var games = [...homegames, ...awaygames]
        games.sort(this.sortLogic)
        

        var draw = 0;
        var won = 0;
        var lost = 0;
        var goalf = 0;
        var goala = 0;
        var yellow = 0;
        var red = 0;
        var last5 = ''



        games.forEach(game => {
            // console.log(teamID, game)
            if (game.hometeamID===teamID){
                goalf += +game.homescore
                goala += +game.awayscore

                JSON.parse(game.hometeamyellow).forEach(player => {
                    yellow += +player.card
                })
                JSON.parse(game.hometeamred).forEach(player => {
                    red += +player.card
                })
            }else{
                goala += +game.homescore
                goalf += +game.awayscore

                JSON.parse(game.awayteamyellow).forEach(player => {
                    yellow += +player.card
                })
                JSON.parse(game.awayteamred).forEach(player => {
                    red += +player.card
                })
            }


            if (game.note === 'draw'){
                draw = draw + 1
                if (last5.length < 5){
                    last5 += 'D'
                }
            }else if(game.note === teamID){
                won = won + 1
                if (last5.length < 5){
                    last5 += 'W'
                }
            }else{
                lost = lost + 1
                if (last5.length < 5){
                    last5 += 'L'
                }
            }
        })

        // console.log(won, lost, draw)
        // console.log(won * 3 + draw * 1 )
        // console.log(goalf, goala, yellow, red)

        db.collection('team').doc(teamID).update({
            won:won,
            draw:draw,
            lost:lost,
            point:won * 3 + draw * 1,
            goalf: goalf,
            goala: goala,
            yellow: yellow,
            red:red,
            last5:last5
        })
        

    }

    updateGoals = async () => {
        let records = {}
        let players = []

        if (this.props.updating){
            players = (this.props.selectedMatch.played && !this.props.selectedMatch.isNonLeague) ? [...JSON.parse(this.props.selectedMatch.hometeamscorers), ...JSON.parse(this.props.selectedMatch.awayteamscorers)]:[]

            
            players.forEach(player => {
                if (player.id in records){
                    records[player.id] = records[player.id]-(+player.score)
                }else{
                    records[player.id] = -(+player.score)
                }
            })
        }

        players = (this.state.played && !this.state.isNonLeague)?[...this.state.hometeamscorers, ...this.state.awayteamscorers]:[]

        players.forEach(player => {
            if (player.id in records){
                records[player.id] = records[player.id]+(+player.score)
            }else{
                records[player.id] = +(+player.score)
            }
        })

        Object.keys(records).forEach(async(id) => {
            try{
                let goal = await db.collection('player').doc(id).get().then(p=>{
                    return p.data().goal
                })
                db.collection('player').doc(id).update({
                    goal : goal+(+records[id])
                })
            }catch(e){

            }
        })
    }

    updateYellowCards = async () => {
        let records = {}
        let players = []
        
        if (this.props.updating){
            players = (this.props.selectedMatch.played && !this.props.selectedMatch.isNonLeague)?[...JSON.parse(this.props.selectedMatch.hometeamyellow), ...JSON.parse(this.props.selectedMatch.awayteamyellow)]:[]
            players.forEach(player => {
                if (player.id in records){
                    records[player.id] = records[player.id]-(+player.card)
                }else{
                    records[player.id] = -(+player.card)
                }
            })
        }


        players = (this.state.played && !this.state.isNonLeague)?[...this.state.hometeamyellow, ...this.state.awayteamyellow]:[]

        players.forEach(player => {
            if (player.id in records){
                records[player.id] = records[player.id]+(+player.card)
            }else{
                records[player.id] = +(+player.card)
            }
        })

        Object.keys(records).forEach(async(id) => {
            try{
                let yellow = await db.collection('player').doc(id).get().then(p=>{
                    return p.data().yellow
                })
                db.collection('player').doc(id).update({
                    yellow : yellow+(+records[id])
                })
            }catch(e){

            }

        })
    }

    updateRedCards = async () => {
        let records = {}
        let players = []
        
        if(this.props.updating){
            players = (this.props.selectedMatch.played && !this.props.selectedMatch.isNonLeague)?[...JSON.parse(this.props.selectedMatch.hometeamred), ...JSON.parse(this.props.selectedMatch.awayteamred)]:[]
            players.forEach(player => {
                if (player.id in records){
                    records[player.id] = records[player.id]-(+player.card)
                }else{
                    records[player.id] = -(+player.card)
                }
            })
        }


        players = (this.state.played && !this.state.isNonLeague)?[...this.state.hometeamred, ...this.state.awayteamred]:[]

        players.forEach(player => {
            if (player.id in records){
                records[player.id] = records[player.id]+(+player.card)
            }else{
                records[player.id] = +(+player.card)
            }
        })

        Object.keys(records).forEach(async(id) => {
            try{
                let red = await db.collection('player').doc(id).get().then(p=>{
                    return p.data().red
                })
                db.collection('player').doc(id).update({
                    red : red+(+records[id])
                })
            }catch(e){
                
            }

        })
    }

    update = async() => {
        await this.updateGoals()
        await this.updateYellowCards()
        await this.updateRedCards()


        if (this.state.updating){
            console.log("UPDATE")
            await db.collection('match').doc(this.props.selectedMatch.id).update(
                {
                    awayscore: this.state.awayscore,
                    awayteam: this.state.awayteam,
                    awayteamID: this.state.awayteamID,
                    awayteamscorers: JSON.stringify(this.state.awayteamscorers),
                    awayteamyellow:JSON.stringify(this.state.awayteamyellow),
                    awayteamred:JSON.stringify(this.state.awayteamred),
        
                    homescore:this.state.homescore,
                    hometeam:this.state.hometeam,
                    hometeamID:this.state.hometeamID,
                    hometeamscorers: JSON.stringify(this.state.hometeamscorers),
                    hometeamyellow: JSON.stringify(this.state.hometeamyellow),
                    hometeamred:JSON.stringify(this.state.hometeamred),
                    
                    place:this.state.place,
                    played:this.state.played,
                    date: this.state.date,
                    time:this.state.time,
                    note:this.state.played?+this.state.homescore>+this.state.awayscore?this.state.hometeamID:+this.state.homescore<+this.state.awayscore?this.state.awayteamID:'draw':"",
                    isNonLeague:this.state.isNonLeague
                }
            )


        }else{
            console.log("NEW")
            await db.collection('match').add({
                awayscore: this.state.awayscore,
                awayteam: this.state.awayteam,
                awayteamID: this.state.awayteamID,
                awayteamscorers: JSON.stringify(this.state.awayteamscorers),
                awayteamyellow:JSON.stringify(this.state.awayteamyellow),
                awayteamred:JSON.stringify(this.state.awayteamred),
    
                homescore:this.state.homescore,
                hometeam:this.state.hometeam,
                hometeamID:this.state.hometeamID,
                hometeamscorers: JSON.stringify(this.state.hometeamscorers),
                hometeamyellow: JSON.stringify(this.state.hometeamyellow),
                hometeamred:JSON.stringify(this.state.hometeamred),
                
                place:this.state.place,
                played:this.state.played,
                // time: new Date(this.state.date+" "+this.state.time)
                date: this.state.date,
                time:this.state.time,
                note:this.state.played?+this.state.homescore>+this.state.awayscore?this.state.hometeamID:+this.state.homescore<+this.state.awayscore?this.state.awayteamID:'draw':"",
                isNonLeague:this.state.isNonLeague
            })
        }

        
        let teamSet = []

        if (this.state.updating){
            teamSet = new Set([this.props.selectedMatch.awayteamID, this.props.selectedMatch.hometeamID, this.state.awayteamID, this.state.hometeamID])
        }else{
            teamSet = new Set([this.state.awayteamID, this.state.hometeamID])
        }
        
        
        teamSet.forEach(team=>{
            this.resetMatches(team)
        })

    }

    handleOnSubmit = (event) => {
        event.preventDefault()

        // if (this.props.updating){
        //     this.update()

        // }else{
        //     // db.collection('match').add({
        //     //     awayscore: this.state.awayscore,
        //     //     awayteam: this.state.awayteam,
        //     //     awayteamID: this.state.awayteamID,
        //     //     awayteamscorers: JSON.stringify(this.state.awayteamscorers),
        //     //     awayteamyellow:JSON.stringify(this.state.awayteamyellow),
        //     //     awayteamred:JSON.stringify(this.state.awayteamred),
    
        //     //     homescore:this.state.homescore,
        //     //     hometeam:this.state.hometeam,
        //     //     hometeamID:this.state.hometeamID,
        //     //     hometeamscorers: JSON.stringify(this.state.hometeamscorers),
        //     //     hometeamyellow: JSON.stringify(this.state.hometeamyellow),
        //     //     hometeamred:JSON.stringify(this.state.hometeamred),
                
        //     //     place:this.state.place,
        //     //     played:this.state.played,
        //     //     // time: new Date(this.state.date+" "+this.state.time)
        //     //     date: this.state.date,
        //     //     time:this.state.time,
        //     //     note:this.state.played?+this.state.homescore>+this.state.awayscore?this.state.hometeamID:+this.state.homescore<+this.state.awayscore?this.state.awayteamID:'draw':""
        //     // })
        //     this.update()
            
        // }

        this.update()
        this.props.onClose()

    }

    handleValueChange= (event, team) => {
        var newState = {
            ...this.state,
            [team]: event.target.value
        }
        this.setState(newState)
    }

    handleHomeScorerChange = (event, value) => {
        this.setState({hometeamscorer:value})
    }

    handleAwayScorerChange = (event, value) => {
        this.setState({awayteamscorer:value})
    }

    handleHomeTeamYellowPlayerChange = (event, value) =>{
        this.setState({hometeamyellowplayer:value})
    }

    handleHomeTeamRedPlayerChange = (event, value) =>{
        this.setState({hometeamredplayer:value})
    }

    handleAwayTeamYellowPlayerChange = (event, value) =>{
        this.setState({awayteamyellowplayer:value})
    }

    handleAwayTeamRedPlayerChange = (event, value) =>{
        this.setState({awayteamredplayer:value})
    }

    valueMapping = {
        homescorergoal:['hometeamscorers','hometeamscorer'],
        awayscorergoal:['awayteamscorers','awayteamscorer'],
        hometeamyellownumber:['hometeamyellow', 'hometeamyellowplayer'],
        hometeamrednumber:['hometeamred', 'hometeamredplayer'],
        awayteamyellownumber:['awayteamyellow', 'awayteamyellowplayer'],
        awayteamrednumber:['awayteamred', 'awayteamredplayer']
    }

    handleAddCard = (key) => {
        let player;
        let card;
        let newList;

        player = this.state[this.valueMapping[key][1]]?this.state[this.valueMapping[key][1]]:{}
        card = this.state[key]

        if ( +card > 0 && 'id' in player > 0){
            newList = [...this.state[this.valueMapping[key][0]]]
            newList.push({
                id:player.id,
                fullName: player.fullName,
                card: card
            })

            this.setState({
                ...this.state,
                [this.valueMapping[key][0]]: newList,
                [key]: '',
                [this.valueMapping[key][1]]: ''
            })
        }

    }

    handleAddScorer = (key) => {
        let player;
        let score;
        let newList;
        switch (key){
            case 'homescorergoal':
                player = this.state[this.valueMapping[key][1]]?this.state[this.valueMapping[key][1]]:{}
                score = this.state[key]

                if ( +score > 0 && 'id' in player > 0){
                    newList = [...this.state[this.valueMapping[key][0]]]
                    newList.push({
                        id:player.id,
                        fullName: player.fullName,
                        score: score
                    })

                    // db.collection('player').doc(player.id).get().then(p=>{
                    //     db.collection('player').doc(player.id).update({
                    //         goal : +p.data().goal+(+score)
                    //     })
                    // })


                    this.setState({
                        ...this.state,
                        [this.valueMapping[key][0]]: newList,
                        [key]: '',
                        [this.valueMapping[key][1]]: ''
                    })
                }
                break
            case 'awayscorergoal':
                player = this.state[this.valueMapping[key][1]]?this.state[this.valueMapping[key][1]]:{}
                score = this.state[key]

                if ( +score > 0 && 'id' in player > 0){
                    newList = [...this.state[this.valueMapping[key][0]]]
                    newList.push({
                        id:player.id,
                        fullName: player.fullName,
                        score: score
                    })

                    // db.collection('player').doc(player.id).get().then(p=>{
                    //     db.collection('player').doc(player.id).update({
                    //         goal : +p.data().goal+(+score)
                    //     })
                    // })

                    this.setState({
                        ...this.state,
                        [this.valueMapping[key][0]]: newList,
                        [key]: '',
                        [this.valueMapping[key][1]]: ''
                    })
                }
                break
            default:
                player = this.state[this.valueMapping[key][1]]?this.state[this.valueMapping[key][1]]:{}
                score = this.state[key]

                if ( +score > 0 && 'id' in player > 0){
                    newList = [...this.state[this.valueMapping[key][0]]]
                    newList.push({
                        id:player.id,
                        fullName: player.fullName,
                        score: score
                    })

                    // db.collection('player').doc(player.id).get().then(p=>{
                    //     db.collection('player').doc(player.id).update({
                    //         goal : +p.data().goal+(+score)
                    //     })
                    // })

                    this.setState({
                        ...this.state,
                        [this.valueMapping[key][0]]: newList,
                        [key]: '',
                        [this.valueMapping[key][1]]: ''
                    })
                }
                break
        }

    }

    handleCardPlayer = (key) =>{

    }


    handleTimeChange = (event, option) => {
        // console.log(event.target.value)
    }

    handleCheckBox = (event) => {
        // console.log(event.target)
        this.setState({[event.target.value]:event.target.checked})
    }

    handleHomeTeamChange = (event, value) =>{

        if (value){
            var query = db.collection('player').where('teamID', "==", value.id)
            
            query.get().then(function(querySnapshot){
                let players = querySnapshot.docs.map(doc=>{
                    return{
                        id:doc.id,
                        ...doc.data()
                    }
                })

                this.setState({
                    hometeam:value.teamName,
                    hometeamID:value.id,
                    homeplayers:players
                })

            }.bind(this))

        }


    }

    handleAwayTeamChange = (event, value) => {
        if (value){
            var query = db.collection('player').where('teamID', "==", value.id)
            
            query.get().then(function(querySnapshot){
                let players = querySnapshot.docs.map(doc=>{
                    return{
                        id:doc.id,
                        ...doc.data()
                    }
                })

                this.setState({
                    awayteam:value.teamName,
                    awayteamID:value.id,
                    awayplayers:players
                })

            }.bind(this))

        }
    }

    onDeleteChip(player, option){
        // db.collection('player').doc(player.id).get().then(p=>{
        //     db.collection('player').doc(player.id).update({
        //         goal : +p.data().goal-(+player.score)
        //     })
        // })


        let index = this.state[option].indexOf(player)
        let newList = JSON.parse(JSON.stringify(this.state[option]))
        newList.splice(index, 1)
        this.setState({
            [option]: newList
        })
    }

    render(){
        const {classes} = this.props
        return (
            <Container maxWidth={false}>
                <div className={classes.paper}>
                    <form className={classes.form} onSubmit={this.handleOnSubmit} autoComplete="off">
                        <Grid container spacing={2} >
                            <Grid item xs={12} sm={8}>
                                <Autocomplete
                                id="home-team"
                                options={this.props.teams}
                                // getOptionLabel={option => option.teamName}
                                getOptionLabel={option => typeof option === 'string' ? option : option.teamName}
                                onChange={this.handleHomeTeamChange}
                                value={this.state.hometeam}
                                renderInput={params => <TextField required {...params} label="Home Team" variant="outlined" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    onChange={(event) => this.handleValueChange(event, 'homescore')}
                                    value={this.state.homescore}
                                    id="standard-number"
                                    label="Home Score"
                                    type="number"
                                    />
                            </Grid>

                            <Grid item container xs={12} spacing={2} justify="flex-end">
                                <Grid item xs={8} sm={7}>
                                    <Autocomplete
                                    id="home-team-scorer"
                                    options={this.state.homeplayers}
                                    value={this.state.hometeamscorer}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.fullName}
                                    // getOptionLabel={option => option.title}
                                    onChange={this.handleHomeScorerChange}
                                    renderInput={params => <TextField {...params} label="Scorer" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={8} sm={2}>
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.handleValueChange(event, 'homescorergoal')}
                                        id="standard-number"
                                        label="Goal #"
                                        type="number"
                                        value={this.state.homescorergoal}
                                        />
                                </Grid>
                                <Grid item xs={8} sm={1}>
                                    <IconButton onClick={() => this.handleAddScorer('homescorergoal')}>
                                        <AddBoxIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.hometeamscorers.map((player, index) => {
                                        return <Chip key={"homeplayer-"+index} label={<div>{player.fullName + ','} <img width="12px" src={process.env.PUBLIC_URL + '/img/ball.svg'} alt=""/> {'x'+player.score}</div>} onDelete={()=>this.onDeleteChip(player, 'hometeamscorers')}/>
                                    })}
                                                                          
                                </Grid>
                            </Grid>


                            <Grid item container xs={12} spacing={2} justify="flex-end">
                                <Grid item xs={8} sm={7}>
                                    <Autocomplete
                                    id="home-team-yellow"
                                    options={this.state.homeplayers}
                                    value={this.state.hometeamyellowplayer}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.fullName}
                                    // getOptionLabel={option => option.title}
                                    onChange={this.handleHomeTeamYellowPlayerChange}
                                    renderInput={params => <TextField {...params} label="Yellow Card" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={8} sm={2}>
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.handleValueChange(event, 'hometeamyellownumber')}
                                        id="standard-number"
                                        label="Yellow #"
                                        type="number"
                                        value={this.state.hometeamyellownumber}
                                        />
                                </Grid>
                                <Grid item xs={8} sm={1}>
                                    <IconButton onClick={() => this.handleAddCard('hometeamyellownumber')}>
                                        <AddBoxIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                
                                    {this.state.hometeamyellow.map((player, index) => {
                                        return <Chip key={"hometeamyellow-"+index} label={<div>{player.fullName+","} <img width="10px" src={process.env.PUBLIC_URL + '/img/Yellow_card.svg'} alt=""/> {'x' + player.card}</div>} onDelete={()=>this.onDeleteChip(player, 'hometeamyellow')}/>
                                    })}
                                                                          
                                </Grid>
                            </Grid>


                            <Grid item container xs={12} spacing={2} justify="flex-end">
                                <Grid item xs={8} sm={7}>
                                    <Autocomplete
                                    id="home-team-red"
                                    options={this.state.homeplayers}
                                    value={this.state.hometeamredplayer}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.fullName}
                                    // getOptionLabel={option => option.title}
                                    onChange={this.handleHomeTeamRedPlayerChange}
                                    renderInput={params => <TextField {...params} label="Red Card" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={8} sm={2}>
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.handleValueChange(event, 'hometeamrednumber')}
                                        id="standard-number"
                                        label="Red #"
                                        type="number"
                                        value={this.state.hometeamrednumber}
                                        />
                                </Grid>
                                <Grid item xs={8} sm={1}>
                                    <IconButton onClick={() => this.handleAddCard('hometeamrednumber')}>
                                        <AddBoxIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.hometeamred.map((player, index) => {
                                        return <Chip key={"hometeamred-"+index} label={<div>{player.fullName+","} <img width="10px" src={process.env.PUBLIC_URL + '/img/Red_card.svg'} alt=""/> {'x' + player.card}</div>} onDelete={()=>this.onDeleteChip(player, 'hometeamyellow')}/>
                                    })}
                                                                          
                                </Grid>
                            </Grid>



                            <Grid item xs={12}>
                                <hr className={cssClasses.LINE} />
                            </Grid>




                            <Grid item xs={12} sm={8}>
                                <Autocomplete
                                    id="away-team"
                                    options={this.props.teams}
                                    value={this.state.awayteam}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.teamName}
                                    renderInput={params => <TextField required {...params} label="Away Team" variant="outlined" />}
                                    onChange={this.handleAwayTeamChange}
                                    />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    onChange={(event) => this.handleValueChange(event, 'awayscore')}
                                    id="standard-number"
                                    value={this.state.awayscore}
                                    label="Away Score"
                                    type="number"
                                    />
                            </Grid>


                            <Grid item container xs={12} spacing={2} justify="flex-end">
                                <Grid item xs={8} sm={7}>
                                    <Autocomplete
                                    id="away-team-scorer"
                                    options={this.state.awayplayers}
                                    value={this.state.awayteamscorer}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.fullName}
                                    // getOptionLabel={option => option.title}
                                    onChange={this.handleAwayScorerChange}
                                    renderInput={params => <TextField {...params} label="Scorer" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={8} sm={2}>
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.handleValueChange(event, 'awayscorergoal')}
                                        id="standard-number"
                                        label="Goal #"
                                        type="number"
                                        value={this.state.awayscorergoal}
                                        />
                                </Grid>
                                <Grid item xs={8} sm={1}>
                                    <IconButton onClick={() => this.handleAddScorer('awayscorergoal')}>
                                        <AddBoxIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.awayteamscorers.map((player, index) => {
                                        return <Chip key={"awayplayer-"+index} label={<div>{player.fullName + ','} <img width="12px" src={process.env.PUBLIC_URL + '/img/ball.svg'} alt=""/> {'x'+player.score}</div>} onDelete={()=>this.onDeleteChip(player, 'hometeamscorers')}/>
                                    })}
                                                                          
                                </Grid>
                            </Grid>



                            <Grid item container xs={12} spacing={2} justify="flex-end">
                                <Grid item xs={8} sm={7}>
                                    <Autocomplete
                                    id="away-team-yellow"
                                    options={this.state.awayplayers}
                                    value={this.state.awayteamyellowplayer}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.fullName}
                                    // getOptionLabel={option => option.title}
                                    onChange={this.handleAwayTeamYellowPlayerChange}
                                    renderInput={params => <TextField {...params} label="Yellow Card" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={8} sm={2}>
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.handleValueChange(event, 'awayteamyellownumber')}
                                        id="standard-number"
                                        label="Yellow #"
                                        type="number"
                                        value={this.state.awayteamyellownumber}
                                        />
                                </Grid>
                                <Grid item xs={8} sm={1}>
                                    <IconButton onClick={() => this.handleAddCard('awayteamyellownumber')}>
                                        <AddBoxIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.awayteamyellow.map((player, index) => {
                                        return <Chip key={"awayteamyellow-"+index} label={<div>{player.fullName+","} <img width="10px" src={process.env.PUBLIC_URL + '/img/Yellow_card.svg'} alt=""/> {'x' + player.card}</div>} onDelete={()=>this.onDeleteChip(player, 'hometeamyellow')}/>
                                    })}
                                                                          
                                </Grid>
                            </Grid>


                            <Grid item container xs={12} spacing={2} justify="flex-end">
                                <Grid item xs={8} sm={7}>
                                    <Autocomplete
                                    id="away-team-red"
                                    options={this.state.awayplayers}
                                    value={this.state.awayteamredplayer}
                                    getOptionLabel={option => typeof option === 'string' ? option : option.fullName}
                                    // getOptionLabel={option => option.title}
                                    onChange={this.handleAwayTeamRedPlayerChange}
                                    renderInput={params => <TextField {...params} label="Red Card" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={8} sm={2}>
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.handleValueChange(event, 'awayteamrednumber')}
                                        id="standard-number"
                                        label="Red #"
                                        type="number"
                                        value={this.state.awayteamrednumber}
                                        />
                                </Grid>
                                <Grid item xs={8} sm={1}>
                                    <IconButton onClick={() => this.handleAddCard('awayteamrednumber')}>
                                        <AddBoxIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.awayteamred.map((player, index) => {
                                        return <Chip key={"awayteamred-"+index} label={<div>{player.fullName+","} <img width="10px" src={process.env.PUBLIC_URL + '/img/Red_card.svg'} alt=""/> {'x' + player.card}</div>} onDelete={()=>this.onDeleteChip(player, 'hometeamyellow')}/>
                                    })}
                                                                          
                                </Grid>
                            </Grid>



                            <Grid item xs={12}>
                                <hr className={cssClasses.LINE} />
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="date"
                                    label="Date"
                                    type="date"
                                    value={this.state.date}
                                    fullWidth
                                    inputProps={{
                                        max:"9999-12-31"
                                    }}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={(event) => this.handleValueChange(event,'date')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="startTime"
                                    label="Start Time"
                                    type="time"
                                    value={this.state.time}
                                    fullWidth
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    inputProps={{
                                    step: 300, // 5 min
                                    }}
                                    onChange={(event) => this.handleValueChange(event,'time')}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    onChange={(event) => this.handleValueChange(event, 'place')}
                                    value={this.state.place}
                                    id="standard-text"
                                    label="Location"
                                    type="text"
                                    />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                    <Checkbox checked={this.state.played} onChange={this.handleCheckBox} value="played" />
                                    }
                                    label="Played"
                                />
                                <FormControlLabel
                                    control={
                                    <Checkbox checked={this.state.isNonLeague} onChange={this.handleCheckBox} value="isNonLeague" />
                                    }
                                    label="Non-League Match"
                                />
                            </Grid>

                        </Grid>


            
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit + " SubmitButton"}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </Container>
        )
    }
}

export default withStyles(styles)(EditForm);