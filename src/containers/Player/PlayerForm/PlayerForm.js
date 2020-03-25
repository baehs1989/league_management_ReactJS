import React, { Component} from "react";
import { Button, TextField, Grid, Container, Select, MenuItem} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import {db} from '../../../Firebase'

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

class PlayerForm extends Component {
    state = {
        firstName:"",
        lastName:"",
        birthDay:"1999-10-01",
        jerseyNumber:"",
        phoneNumber:"",
        email:"",
        address1:"",
        address2:"",
        city:"",
        state:"",
        zipcode:"",
        country:"",
        team:"",
        teamID:"",
        goal:0,
        yellow:0,
        red:0,
        shown:true
    }

    componentDidMount(){
        if (this.props.updating){
            this.setState({...this.props.selectedPlayer})
        }else{
            if (this.props.selectedTeam.length > 0){
                let index = this.props.teams.findIndex((el)=>el.id===this.props.selectedTeam)
                this.setState({teamID:this.props.selectedTeam, team:this.props.teams[index].teamName})
            }
        }
    }

    handleOnChange = event => {
        this.setState({
            [event.target.id]:event.target.value
        })
    }

    handleOnSubmit = async(event) => {
        event.preventDefault();

        if (this.props.updating){
            await db.collection('player').doc(this.props.selectedPlayer.id).update(
                {
                    ...this.state,
                    fullName: this.state.firstName + ' ' + this.state.lastName
                }
            )

            let teams = [this.props.selectedPlayer.teamID, this.state.teamID]
            
            teams.forEach(id => {
                if (id.length > 0){
                    db.collection('player').where('teamID', '==', id).onSnapshot(onsnapshot => {
                        let players = onsnapshot.docs.map(doc => {
                            return {
                                id: doc.id
                            }
                        })
        
                        db.collection('team').doc(id).update({
                            players:players.length
                        })
                    })
                }
            })

            
            

        }else{
            await db.collection('player').add({
                ...this.state,
                fullName: this.state.firstName + ' ' + this.state.lastName
            })

            if (this.state.teamID.length > 0){
                db.collection('player').where('teamID', '==', this.state.teamID).onSnapshot(onsnapshot => {
                    let players = onsnapshot.docs.map(doc => {
                        return {
                            id: doc.id
                        }
                    })
    
                    db.collection('team').doc(this.state.teamID).update({
                        players:players.length
                    })
                })
            }


        }
        this.props.handleSubmit()

    }

    handleTeamChange = (event) => {
        // console.log(this.props.teams)
        // console.log(event.target.value)
        var team = this.props.teams.find(el => {
            return el.id === event.target.value
        })
        this.setState({team:team.teamName, teamID:team.id})
        // this.setState({team:event.target})
    }

    render(){
        const {classes} = this.props

        return (
            <Container component="main" maxWidth={false}>
                <div className={classes.paper}>
                    {/* <Avatar className={classes.avatar}>
                        <FontAwesomeIcon icon={faUser} />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        New Player
                    </Typography> */}
                    <form className={classes.form} onChange={this.handleOnChange} onSubmit={this.handleOnSubmit} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                    <Select value={this.state.teamID} onChange={this.handleTeamChange} displayEmpty>
                                        <MenuItem value="">
                                            <em>Select a team</em>
                                        </MenuItem>
                                        {this.props.teams.map(team => {
                                            return (
                                                <MenuItem key={team.id} value={team.id}>{team.teamName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={this.state.firstName}
                                    autoFocus
                                    autoComplete="off"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={this.state.lastName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={7}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="birthDay"
                                    label="Birthday"
                                    type="date"
                                    id="birthDay"
                                    inputProps={{
                                        max:"9999-12-31"
                                    }}
                                    // defaultValue="2017-05-24"
                                    value={this.state.birthDay}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="jerseyNumber"
                                    label="Jersey Number"
                                    type="number"
                                    id="jerseyNumber"
                                    value={this.state.jerseyNumber}
                                />
                            </Grid>

                            <hr/>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    name="phoneNumber"
                                    label="Phone Number"
                                    type="number"
                                    id="phoneNumber"
                                    value={this.state.phoneNumber}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={this.state.email}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    name="address1"
                                    label="Address Line 1"
                                    id="address1"
                                    value={this.state.address1}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="address2"
                                    label="Address Line 2"
                                    id="address2"
                                    value={this.state.address2}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    name="city"
                                    label="City"
                                    id="city"
                                    value={this.state.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="state"
                                    label="State/Region/Provice"
                                    id="state"
                                    value={this.state.state}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="zipcode"
                                    label="Zip / Postal Code"
                                    id="zipcode"
                                    value={this.state.zipcode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="country"
                                    label="Country"
                                    id="country"
                                    value={this.state.country}
                                />
                            </Grid>
                            

                            <Grid item xs={12}>
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
                        {/* <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid> */}
                    </form>
                </div>
            </Container>
        )
    }
}

export default withStyles(styles)(PlayerForm);