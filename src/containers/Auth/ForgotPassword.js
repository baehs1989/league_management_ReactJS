import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {fb} from '../../Firebase';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import classes from './Login.module.css'
import Snackbar from '@material-ui/core/Snackbar';

class ForgotPassword extends Component {
    state = {
        email: '',
        error: null,
        erroropen:false,
        confirm:null,
        confirmopen:false
    };
    handleSubmit = (event) => {
        event.preventDefault();
        fb.auth().sendPasswordResetEmail(this.state.email).then(function(result){
            this.setState({confirmopen:true, confirm:"Email Sent"})
        }.bind(this)).catch(function(error){
            this.setState({erroropen:true, error:error.message})
        }.bind(this))
    };

    handleinputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClose = () =>[
        this.setState({erroropen:false, confirmopen:false})
    ]

    render(){
        return (
            <Container component="div" maxWidth="xs" className={classes.Main}>
                <div className={classes.Paper}>
                    <Avatar className={classes.Avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Password Reset
                    </Typography>

                    <Snackbar 
                        anchorOrigin={{
                            vertical:'top',
                            horizontal:'center'
                        }}
                        open={this.state.erroropen} 
                        autoHideDuration={6000} 
                        onClose={this.handleClose}>
                        <Alert severity="error">{this.state.error}</Alert>
                    </Snackbar>
                    <Snackbar 
                        anchorOrigin={{
                            vertical:'top',
                            horizontal:'center'
                        }}
                        open={this.state.confirmopen} 
                        autoHideDuration={6000} 
                        onClose={this.handleClose}>
                        <Alert severity="success">{this.state.confirm}</Alert>
                    </Snackbar>

                    <form className={classes.Form} noValidate onChange={this.handleinputChange} onSubmit={this.handleSubmit}>
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        type="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={this.state.email}
                        autoFocus
                        />
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.Submit + " SubmitButton"}
                        >
                        Send Email
                        </Button>
                </form>
                </div>
            </Container>
        )
    }
}

export default withRouter(ForgotPassword)