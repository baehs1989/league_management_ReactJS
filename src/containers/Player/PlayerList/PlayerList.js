import React, { Component} from "react";
import {Container} from '@material-ui/core'
import EnhancedTable from './EnhancedTable/EnhancedTable'
import AppBar from './AppBar'
import Dialog from './Dialog'
import {db} from '../../../Firebase'
import CustomDialog from '../../CustomDialog/CustomDialog'

var tablesetup = {
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
    hidden:['id', 'phoneNumber', 'email', 'address1', 'address2', 'city', 'state', 'zipcode', 'country', 'teamID', 'birthDay'],
    editable: true,
}

class PlayerList extends Component {
    _isMounted = false

    state ={
        list:[

        ],
        teams:[

        ],
        selectedTeam:"",
        dialog: false,
        search: "",
        updating: false,
        selectedPlayer: {},
        selected:[],
        open:false
    }

    componentDidMount(){
        this._isMounted=true
        db.collection('player').where('shown', '==', true).onSnapshot(snapshot => {
            const allPlayer = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    id:doc.id,
                    jerseyNumber:doc.data().jerseyNumber,
                    lastName:doc.data().lastName,
                    firstName:doc.data().firstName,
                    birthDay:doc.data().birthDay,
                    yellow:doc.data().goal,
                    red:doc.data().goal,
                    goal:doc.data().goal,
                    team:doc.data().team,
                    teamID:doc.data().teamID,
                    phoneNumber:doc.data().phoneNumber,
                    email:doc.data().email,
                    address1:doc.data().address1,
                    address2:doc.data().address2,
                    city:doc.data().city,
                    state:doc.data().state,
                    zipcode:doc.data().zipcode,
                    country:doc.data().country,

                }
            })
            if(this._isMounted){
                this.setState({list:allPlayer})
            }
            
        })        

        db.collection('team').where('shown','==',true).onSnapshot(snapshot => {
            const allTeam = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    id:doc.id,
                    teamName:doc.data().teamName
                }
            })
            if (this._isMounted){
                this.setState({teams:allTeam})
            }
            
        })     


    }

    componentWillUnmount(){
        this._isMounted=false
    }

    handleDialogOpen = () => {
        this.setState({dialog:true})
    };
    
    handleDialogClose = () => {
        this.setState({dialog:false, updating:false});
    };

    handleUpdateOpen = (row) => {
        this.setState({dialog:true, updating:true, selectedPlayer:{...row}})
    }

    handleSubmit = () => {
        this.handleDialogClose()
    }

    handleOnSearchChange = (evt) => {
        this.setState({search : evt.target.value.toLowerCase()})
    }

    handleSelectTeamChange = (evt) => {
        this.setState({selectedTeam:evt.target.value, search:""})
    }

    handleDeleteButtonClick = (value) => {
        // var index = this.state.list.indexOf(value)
        // var newList = JSON.parse(JSON.stringify(this.state.list))
        // newList.splice(index, 1)
        // this.setState({list:newList})
        // db.collection('player').doc(value.id).update({
        //     shown:false
        // })
        this.setState({selected:[value.id], open:true})
        
    }

    handleSelect = (newSelected) => {
        this.setState({selected:newSelected})
    }

    handleSelectAll = (newSelected) => {
        this.setState({selected:newSelected})
    }

    handleDelete = () => {
        // this.state.selected.forEach(id => {
        //     db.collection('player').doc(id).update({
        //         shown:false
        //     })
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
            return Object.values(obj).join("||").toLowerCase().includes(this.state.search) && obj.teamID.includes(this.state.selectedTeam)
        })

        tablesetup.editable = this.props.admin
        var tablecontent = {list:filtered_list, ...tablesetup}

        return (
            <Container component="main" maxWidth={false}>
                <AppBar handleDialogOpen={this.handleDialogOpen} search={this.state.search} handleOnSearchChange={this.handleOnSearchChange} handleSelectTeamChange={this.handleSelectTeamChange} selectedTeam={this.state.selectedTeam} teams={this.state.teams} admin={this.props.admin}/>
                <EnhancedTable 
                    tablecontent={tablecontent} 
                    editable={true} 
                    handleUpdateOpen={this.handleUpdateOpen}
                    handleDeleteButtonClick={this.handleDeleteButtonClick}

                    handleSelect={this.handleSelect}
                    handleSelectAll={this.handleSelectAll}
                    handleDelete={this.handleDelete}
                />
                <Dialog handleSubmit={this.handleSubmit} handleDialogOpen={this.handleDialogOpen} handleDialogClose={this.handleDialogClose} teams={this.state.teams} dialog={this.state.dialog} updating={this.state.updating} selectedPlayer={this.state.selectedPlayer} selectedTeam={this.state.selectedTeam}/>
                <CustomDialog 
                    open={this.state.open} 
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

export default PlayerList;