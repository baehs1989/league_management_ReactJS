import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {fb} from '../../Firebase';
import {db} from '../../Firebase';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import classes from './Login.module.css'
import Snackbar from '@material-ui/core/Snackbar';
import {Link as LINK} from 'react-router-dom'

class Login extends Component {
    state = {
        email: '',
        password: '',
        error: null,
        erroropen:false
    };
    handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        fb.auth().signInWithEmailAndPassword(email, password).then((user) => {

            db.collection('admin').where('email', '==', fb.auth().currentUser.email).onSnapshot(snapshot=>{
                const admin = snapshot.docs.map(doc=>{
                    return {
                        id: doc.id,
                        email: doc.data().email,
                        level: doc.data().level,
                        editable: doc.data().editable
                    }
                })
                this.props.updateAuthStatus(true)

                if (+admin[0].level === 1){
                    this.props.history.push('/');
                }else{
                    this.props.history.push('/myteam');
                }
                
            })


            
            
        }).catch((error) => {
            this.setState({ error: error.message, erroropen:true });
        });
    };

    handleinputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClose = () =>[
        this.setState({erroropen:false})
    ]

    render(){
        return (
            <Container component="div" maxWidth="xs" className={classes.Main}>
                <div className={classes.Paper}>
                    <Avatar className={classes.Avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
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

                    <form className={classes.Form} noValidate onChange={this.handleinputChange} onSubmit={this.handleSubmit}>
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={this.state.email}
                        autoFocus
                        />
                        <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={this.state.password}
                        autoComplete="current-password"
                        />
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.Submit + " SubmitButton"}
                        >
                        Sign In
                        </Button>
                    <Grid container>
                        <Grid item xs>
                            <LINK to="/forgotpassword">
                                    Forgot password?
                            </LINK>

                        </Grid>
                    </Grid>
                </form>
                </div>
            </Container>
        )
    }
}

export default withRouter(Login)