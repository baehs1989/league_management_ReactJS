import React, { Component} from "react";
import {Container} from '@material-ui/core'
import EnhancedTable from './EnhancedTable/EnhancedTable'
import AppBar from './AppBar'
import Dialog from './Dialog'
import {fb} from '../../Firebase'
import {db} from '../../Firebase'
import CustomDialog from '../CustomDialog/CustomDialog'

const tablesetup = {
    header:[
        { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
        { id: 'jerseyNumber', numeric: false, disablePadding: false, label: 'Jersey #' },
        { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
        { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
        { id: 'birthDay', numeric: false, disablePadding: false, label: 'DOB' },
        { id: 'yellow', numeric: false, disablePadding: false, label: 'Yellow'},
        { id: 'red', numeric: false, disablePadding: false, label: 'Red'},
        { id: 'team', numeric: false, disablePadding: false, label: 'Team'},
        { id: 'goal', numeric: false, disablePadding: false, label: 'Goal'}
    ],
    pagination:true,
    rowsPerPageOptions:[5,10,25],
    rowsPerPage:10,
    hidden:['id', 'phoneNumber', 'email', 'address1', 'address2', 'city', 'state', 'zipcode', 'country', 'team'],
    editable:true,
    formeditable:true,
    editableID:['jerseyNumber'],
    selectedPlayer: {},
    updating:false,
    selected:[],
    open:false
}


class MyTeam extends Component {
    _isMounted = false

    componentDidMount(){
        this._isMounted = true

        if (!this.props.authenticated){
            this.props.history.push('/login')
        }else{
            // console.log(fb.auth().currentUser.email)
            db.collection('team').where('adminID', '==', fb.auth().currentUser.email).onSnapshot(snapshot => {
                const team = snapshot.docs.map(doc => {
                    return {
                        id:doc.id,
                        ...doc.data()
                    }
                })
                if (team.length > 0){
                    db.collection('player').where('teamID', '==', team[0].id).where('shown', '==', true).onSnapshot(snapshot => {
                        const players = snapshot.docs.map(doc=>{
                            return {
                                id:doc.id,
                                jerseyNumber:doc.data().jerseyNumber,
                                lastName:doc.data().lastName,
                                firstName:doc.data().firstName,
                                birthDay:doc.data().birthDay,
                                yellow:doc.data().yellow,
                                red:doc.data().red,
                                goal:doc.data().goal,
                                team: doc.data().team,
                                phoneNumber:doc.data().phoneNumber,
                                email:doc.data().email,
                                address1:doc.data().address1,
                                address2:doc.data().address2,
                                city:doc.data().city, 
                                state:doc.data().state, 
                                zipcode:doc.data().zipcode, 
                                country:doc.data().country
                            }
                        })
                        if (this._isMounted){
                            this.setState({list:players, team:team[0].teamName, teamID:team[0].id})
                        }
                    })
                }

            })     
        }

    }

    componentWillUnmount(){
        this._isMounted = false
    }
    
    state ={
        list:[],
        dialog: false,
        search: "",
        editing: false,
        editingIndex:0,
        teamID:"",
        team:""
    }

    handleDialogOpen = () => {
        this.setState({dialog:true})
    };
    
    handleDialogClose = () => {
        this.setState({dialog:false, updating:false});
    };
    
    handleOnSearchChange = (evt) => {
        this.setState({search : evt.target.value.toLowerCase()})
    }


    handleUpdateOpen = (row) => {
        this.setState({dialog:true, updating:true, selectedPlayer:{...row}})
    }


    handleEditButtonClick = (index) => {
        this.setState({editing:true,editingIndex:index})
    }

    handleDeleteButtonClick = (value) => {
        // var index = this.state.list.indexOf(value)
        // var newList = JSON.parse(JSON.stringify(this.state.list))
        // newList.splice(index, 1)
        // this.setState({list:newList})
        this.setState({selected:[value.id], open:true})
    }

    handleCancelButtonClick = () => {
        this.setState({editing:false})
    }

    handleSubmit = () => {
        this.handleDialogClose()
    }

    handleCheckButtonClick = (oldValue, updatedValue) => {
        // var newList = JSON.parse(JSON.stringify(this.state.list))

        // var newValue = {
        //     ...oldValue,
        //     ...updatedValue
        // }

        // var index = this.state.list.indexOf(oldValue)
        // newList[index] = newValue

        // this.setState({editing:false,list:newList})
        db.collection('player').doc(oldValue.id).update(
            updatedValue
        )
        this.setState({editing:false})
    }


    handleSelect = (newSelected) => {
        this.setState({selected:newSelected})
    }

    handleSelectAll = (newSelected) => {
        this.setState({selected:newSelected})
    }

    handleDelete = () => {
        // this.state.selected.forEach(id => {
        //     db.collection('player').doc(id).delete()
        // })
        this.setState({open:true})
    }

    handleOpen = () => {
        this.setState({open:true})
    }

    handleClose = () => {
        this.setState({open:false})
    }

    handleConfirm = () => {
        this.state.selected.forEach(id => {
            db.collection('player').doc(id).update({
                shown:false
            })
        })
        this.setState({open:false, selected:[]})
    }


    render(){

        var filtered_list = this.state.list.filter(obj => {
            return (obj.lastName+"||"+obj.firstName).toLowerCase().includes(this.state.search)
        })


        var tablecontent = {list:filtered_list, ...tablesetup}

        return (
            <Container component="main" maxWidth={false}>
                <AppBar handleDialogOpen={this.handleDialogOpen} search={this.state.search} handleOnSearchChange={this.handleOnSearchChange} isEditable={this.props.isEditable}/>
                <EnhancedTable 
                    tablecontent={tablecontent} 
                    editing={this.state.editing} 
                    editingIndex={this.state.editingIndex} 
                    handleCancelButtonClick={this.handleCancelButtonClick}
                    handleEditButtonClick={this.handleEditButtonClick}
                    handleDeleteButtonClick={this.handleDeleteButtonClick}
                    handleCheckButtonClick={this.handleCheckButtonClick}
                    handleUpdateOpen={this.handleUpdateOpen}

                    handleSelect={this.handleSelect}
                    handleSelectAll={this.handleSelectAll}
                    handleDelete={this.handleDelete}

                    isEditable={this.props.isEditable}
                    />
                <Dialog handleSubmit={this.handleSubmit} handleDialogOpen={this.handleDialogOpen} handleDialogClose={this.handleDialogClose} dialog={this.state.dialog} updating={this.state.updating} selectedPlayer={this.state.selectedPlayer} team={this.state.team} teamID={this.state.teamID}/>
                <CustomDialog 
                    open={this.state.open||false} 
                    onClose={this.handleClose} 
                    context="Are you sure you want to delete selected player(s)?"
                    buttons={{
                        button1:{
                            text:"No",
                            func:this.handleClose
                        },
                        button2:{
                            text:"Yes",
                            func:this.handleConfirm
                        }
                    }}/>
            </Container>
        )
    }
}

export default MyTeam;