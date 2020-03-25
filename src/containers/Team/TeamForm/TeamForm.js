import React, { Component} from "react";
import { Button, TextField, Grid, Typography, Container} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import {db, fbconfig} from '../../../Firebase'
import * as firebase from 'firebase/app';

var authApp = firebase.initializeApp(fbconfig, 'authApp')
var detachedAuth = authApp.auth();

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

class TeamForm extends Component {
    state = {
        teamName:"",
        adminID:"",
        teamPassword:"",
        won:0,
        drawn:0,
        lost:0,
        players:0,
        point:0,
        goalf:0,
        goala:0,
        yellow:0,
        red:0,
        last5:'',
        shown:true
    }

    handleOnChange = event => {
        this.setState({
            [event.target.id]:event.target.value
        })
    }

    handleOnSubmit = event => {
        event.preventDefault();

        detachedAuth.createUserWithEmailAndPassword(this.state.adminID, this.state.teamPassword).then(user => {
            db.collection('team').add({
                ...this.state
            })
    
            db.collection('admin').add({
                editable:false,
                email:this.state.adminID,
                level:"2",
                team:this.state.teamName
            })

            detachedAuth.signOut()
            this.props.handleDialogClose()

        }).catch(error => {
            alert(error.message)
        });
        

        // fb.auth().createUserWithEmailAndPassword(this.state.adminID, this.state.teamPassword).then((user) => {
        // })
        // .catch((error) => {
        // });


        
    }

    render(){
        const {classes} = this.props

        return (
            <Container component="main" maxWidth={false}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        New Team
                    </Typography>
                    <form className={classes.form} onChange={this.handleOnChange} onSubmit={this.handleOnSubmit} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="teamName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="teamName"
                                    label="Team Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="adminID"
                                    variant="outlined"
                                    type="email"
                                    required
                                    fullWidth
                                    id="adminID"
                                    label="Team Admin ID"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="teamPassword"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="teamPassword"
                                    label="Temporary Password"
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

export default withStyles(styles)(TeamForm);