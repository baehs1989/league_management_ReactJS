import React, { Component} from "react";
import { Grid, Container} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import ScheduleSlider from './Slider/ScheduleSlider'
import RankingTable from './RankingTable/RankingTable'
import ScoreRanking from './ScoreRanking/ScoreRanking'
import EmbedTwitter from './EmbedTwitter/EmbedTwitter'

const styles = theme => ({    
})

class Main extends Component {
    state = {
    }

    render(){

        return (
            <Container>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <ScheduleSlider/>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <RankingTable/>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <ScoreRanking/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EmbedTwitter/>
                    </Grid>
                </Grid>
                

               
                
            </Container>
        )
    }
}

export default withStyles(styles)(Main);