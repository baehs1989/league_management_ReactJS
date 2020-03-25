import React, { Component} from "react";
import {Container} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import GameSlot from './GameSlot'



const styles = theme => ({
    paper:{
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        backgroundColor:'white'
    },
    date:{
        padding: theme.spacing(2),
        textAlign:'left',
        fontWeight: 'bold',
        fontSize:"1.1rem",
        borderBottom : 'solid 0.5px rgba(224, 224, 224, 1)'
    },
    table:{
        padding: theme.spacing(1),
        width:'100%'
    },
    cell:{
        padding: theme.spacing(1),
        paddingTop: 0,
    }
    
})

class DaySlot extends Component {
    state = {
    }

    render(){
        const {classes} = this.props
        var games = Object.values(this.props.match)[0]

        return (
            <React.Fragment>
                <Container className={classes.paper} elevation={3}>
                    <div className={classes.date}>{games[0].date}</div>
                    <div className={classes.cell}>
                        {games.map((game, index) => {
                            return <GameSlot key={game.date+index} game={game} handleUpdateButtonClick={this.props.handleUpdateButtonClick} handleDialogOpen={this.props.handleDialogOpen} admin={this.props.admin}/>
                        })}
                    </div>
                </Container>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(DaySlot);