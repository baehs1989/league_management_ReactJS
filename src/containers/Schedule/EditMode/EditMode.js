import React, { Component} from "react";
import {Container, Paper, Grid, NativeSelect, TextField} from '@material-ui/core'

import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
const format = 'h:mm a';
const now = moment().hour(0).minute(0);

class EditMode extends Component {
    state = {
        selectedDate : new Date('2014-08-18T21:11:54'),

        list : [
            {
                awayTeam:"sadari",
                homeTeam:'Gunners',
                time:"2014-08-18T21:11:54",
                homeScore:'2',
                awayScore:'3',
                place: "stdium"
            }
        ],
        teams:[
            {id:'1', teamName:'Gunners'},
            {id:'2', teamName:'Sadari'},
            {id:'3', teamName:'Outliers'}
        ],

    }

    handleDateChange = date => {
        this.setState({selectedDate: date})
    }

    onChange = (value) => {
    }

    render(){
        var {selectedDate} = this.state

        return (
            <Container component="main" maxWidth={false}>
                <Paper elevation={1}>
    
                </Paper>

            </Container>
        )
    }
}

export default EditMode;