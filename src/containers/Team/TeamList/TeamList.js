import React, { Component} from "react";
import {Container} from '@material-ui/core'
import EnhancedTable from '../EnhancedTable/EnhancedTable'
import AppBar from './AppBar'
import Dialog from './Dialog'

import {db} from '../../../Firebase';
import CustomDialog from '../../CustomDialog/CustomDialog'

var tablesetup = {
    header:[
        { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
        { id: 'teamName', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'won', numeric: false, disablePadding: false, label: 'Won' },
        { id: 'drawn', numeric: false, disablePadding: false, label: 'Drawn' },
        { id: 'lost', numeric: false, disablePadding: false, label: 'Lost'},
        { id: 'players', numeric: false, disablePadding: false, label: 'Players' },
    ],
    pagination:true,
    rowsPerPageOptions:[5,10,25],
    rowsPerPage:10,
    hidden:['id'],
    editable: true,
    editableID:['teamName'],
}

class TeamList extends Component {
    _isMounted = false
    state ={
        list:[
            // {id:1 ,teamName:"SADARI FC", won:"0", drawn:'0', lost:'1', players: "22"},
            // {id:2 ,teamName:"Gunners FC", won:"0", drawn:'0', lost:'1', players: "22"},
            // {id:3 ,teamName:"Outliers FC", won:"0", drawn:'0', lost:'1', players: "22"},
            // {id:4 ,teamName:"ARRES FC", won:"0", drawn:'0', lost:'1', players: "22"},
            // {id:5 ,teamName:"ARRES FC", won:"0", drawn:'0', lost:'1', players: "22"},
            // {id:6 ,teamName:"ARRES FC", won:"0", drawn:'0', lost:'1', players: "22"}
        ],
        dialog: false,
        search: "",
        editing: false,
        editingIndex:0,
        selected:[],
        open: false
    }

    componentWillUnmount(){
        this._isMounted=false
    }

    componentDidMount = () => {
        // const unsub = db.collection('team').onSnapshot(snapshot => {
        //     const allTeam = snapshot.docs.map(doc => ({
        //         id: doc.id,
        //         ...doc.data(),
        //     }))
        //     console.log(allTeam)
        // })
        this._isMounted = true
        db.collection('team').where('shown','==',true).onSnapshot(snapshot => {
            const allTeam = snapshot.docs.map(doc => {
                // console.log(doc.data())
                return {
                    id:doc.id,
                    teamName:doc.data().teamName,
                    won:doc.data().won,
                    drawn:doc.data().drawn,
                    lost:doc.data().lost,
                    players:doc.data().players
                }
            })

            // console.log(allTeam)
            if (this._isMounted){
                this.setState({list:allTeam})
            }
            
        })
    }

    handleDialogOpen = () => {
        this.setState({dialog:true})
    };
    
    handleDialogClose = () => {
        this.setState({dialog:false});
    };

    handleOnSearchChange = (evt) => {
        this.setState({search : evt.target.value.toLowerCase()})
    }

    handleEditButtonClick = (index) => {
        this.setState({editing:true,editingIndex:index})
    }

    handleDeleteButtonClick = (value) => {
        // console.log(value)
        // db.collection('team').doc(value.id).update({
        //     shown:false
        // })
        // var index = this.state.list.indexOf(value)
        // var newList = JSON.parse(JSON.stringify(this.state.list))
        // newList.splice(index, 1)
        // this.setState({list:newList})
        this.setState({selected:[value.id], open:true})

    }

    updatePlayers = (players, newName, batch) => {
        players.forEach(player => {
            batch.update(db.collection('player').doc(player.id), {team:newName})
            // db.collection('player').doc(player.id).update({
            //     team:newName
            // })
        })
    }

    updateMatch = (matches, option, newValue, batch) => {
        matches.forEach(match => {
            batch.update(db.collection('match').doc(match.id), {[option]:newValue})
            // db.collection('match').doc(match.id).update({
            //     [option]:newValue
            // })
        })
    }

    handleCheckButtonClick = async (oldValue, updatedValue) => {
        // var newList = JSON.parse(JSON.stringify(this.state.list))

        // var newValue = {
        //     ...oldValue,
        //     ...updatedValue
        // }

        // var index = this.state.list.indexOf(oldValue)
        // newList[index] = newValue

        // this.setState({editing:false, list:newList})
        let batch = db.batch()

        batch.update(db.collection('team').doc(oldValue.id), updatedValue)



        // db.collection('team').doc(oldValue.id).update(
        //     updatedValue
        // )

        await db.collection('player').where('teamID','==',oldValue.id).get().then(snapshot=>{
            snapshot.forEach(doc => {
                batch.update(db.collection('player').doc(doc.id), {team:updatedValue.teamName})
            });
        })

        await db.collection('match').where('hometeamID', '==' , oldValue.id).get().then(snapshot=>{
            snapshot.forEach(doc => {
                batch.update(db.collection('match').doc(doc.id), {hometeam:updatedValue.teamName})
            });
        })

        await db.collection('match').where('awayteamID', '==' , oldValue.id).get().then(snapshot=>{
            snapshot.forEach(doc => {
                batch.update(db.collection('match').doc(doc.id), {awayteam:updatedValue.teamName})
            });
        })
        

        // await db.collection('player').where('teamID','==',oldValue.id).onSnapshot(snapshot => {
        //     const allPlayer = snapshot.docs.map(doc => {
        //         return {
        //             id:doc.id
        //         }
        //     })
        //     this.updatePlayers([...allPlayer], updatedValue.teamName, batch)
        // })

        // await db.collection('match').where('hometeamID', '==' , oldValue.id).onSnapshot(snapshot => {
        //     const allhomeMatch = snapshot.docs.map(doc => {
        //         return {
        //             id:doc.id
        //         }
        //     })
        //     this.updateMatch([...allhomeMatch], 'hometeam', updatedValue.teamName, batch)
        // })

        // await db.collection('match').where('awayteamID', '==' , oldValue.id).onSnapshot(snapshot => {
        //     const allawayMatch = snapshot.docs.map(doc => {
        //         return {
        //             id:doc.id
        //         }
        //     })
        //     this.updateMatch([...allawayMatch], 'awayteam', updatedValue.teamNamem, batch)
        // })


        batch.commit().then(function(){
            console.log('DONE')
        })


        this.setState({editing:false})

    }

    handleCancelButtonClick = () => {
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
        //     db.collection('team').doc(id).update({
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
            db.collection('team').doc(id).update({
                shown:false
            })
        })
        this.setState({open:false, selected:[]})
    }

    render(){

        var filtered_list = this.state.list.filter(obj => {
            return Object.values(obj).join("||").toLowerCase().includes(this.state.search)
        })

        tablesetup.editable=this.props.admin

        var tablecontent = {list:filtered_list, ...tablesetup}

        return (
            <Container component="main" maxWidth={false}>
                <AppBar handleDialogOpen={this.handleDialogOpen} search={this.state.search} handleOnSearchChange={this.handleOnSearchChange} admin={this.props.admin}/>
                <EnhancedTable 
                    tablecontent={tablecontent} 
                    editing={this.state.editing} 
                    editingIndex={this.state.editingIndex} 
                    handleEditButtonClick={this.handleEditButtonClick}
                    handleCheckButtonClick={this.handleCheckButtonClick}
                    handleCancelButtonClick={this.handleCancelButtonClick}
                    handleDeleteButtonClick={this.handleDeleteButtonClick}

                    handleSelect={this.handleSelect}
                    handleSelectAll={this.handleSelectAll}
                    handleDelete={this.handleDelete}
                />
                <Dialog handleDialogOpen={this.handleDialogOpen} handleDialogClose={this.handleDialogClose} dialog={this.state.dialog}/>
                <CustomDialog 
                    open={this.state.open} 
                    onClose={this.handleClose} 
                    context="Are you sure you want to delete selected team(s)?"
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

export default TeamList;