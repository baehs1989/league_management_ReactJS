import React, { Component} from "react";
import {Button, TextField, Grid, Container} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import {db} from '../../../Firebase'

const styles = theme => ({
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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

class MyPlayerForm extends Component {
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
        teamID:""
    }

    componentDidMount(){
        if (this.props.updating){
            this.setState({...this.props.selectedPlayer, team:this.props.team, teamID:this.props.teamID})
        }else{
            this.setState({team:this.props.team, teamID:this.props.teamID})
        }
    }

    handleOnChange = event => {
        this.setState({
            [event.target.id]:event.target.value
        })
    }

    handleOnSubmit = event => {
        event.preventDefault();

        if (this.props.updating){
            db.collection('player').doc(this.props.selectedPlayer.id).update(
                {
                    ...this.state,
                    fullName: this.state.firstName + ' ' + this.state.lastName
                }
            )
        }else{
            db.collection('player').add({
                ...this.state,
                fullName: this.state.firstName + ' ' + this.state.lastName
            })
        }

        this.props.handleSubmit()
    }

    handleTeamChange = (event) => {
        this.setState({team:event.target.value})
    }

    render(){
        const {classes} = this.props
        

        return (
            <Container component="main" maxWidth={false}>
                <div className={classes.paper}>
                    <form className={classes.form} onChange={this.handleOnChange} onSubmit={this.handleOnSubmit} autoComplete="off">
                        <Grid container spacing={2}>
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
                                    required
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
                                    required
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
                                    required
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
                                    required
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
                            className={classes.submit  + " SubmitButton"}
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

export default withStyles(styles)(MyPlayerForm);