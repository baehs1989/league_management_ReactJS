import React, { Component} from "react";
import {Container, TableCell, Table, TableBody, TableContainer, Paper, TableHead, TableRow} from '@material-ui/core'
import AppBar from './AppBar'
import classes from './Config.module.css'
import {db} from '../../Firebase'
import Switch from '@material-ui/core/Switch';

class Config extends Component {
    _isMounted = false

    state ={
        list : []
    }

    componentDidMount(){
        this._isMounted = true
        db.collection('admin').onSnapshot(snapshot => {
            var allAdmin = snapshot.docs.map(doc=>{
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })

            allAdmin = allAdmin.filter(admin => {
                return +admin.level > 1
            })

            if (this._isMounted){
                this.setState({list:allAdmin})
            }
        })

    }


    componentWillUnmount(){
        this._isMounted=false
    }

    handleChange = (event) => {
        db.collection('admin').doc(event.target.name).update({
            editable:event.target.checked
        })

    }

    render(){
        var tabledata = this.state.list.map(admin => {
            return (
                <TableRow key={admin.team}>
                    <TableCell>
                        {admin.team}
                    </TableCell>
                    <TableCell>
                        {admin.email}
                    </TableCell>
                    <TableCell align="center">
                        <Switch
                            checked={admin.editable}
                            onChange={this.handleChange}
                            name={admin.id}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </TableCell>
                </TableRow>
            )
        })


        return (
            <Container maxWidth={false}>
                <AppBar />

                <TableContainer component={Paper} className={classes.Main}>
                    <Table className={classes.Table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Team</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Editable</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tabledata}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Container>
        )
    }
}

export default Config;