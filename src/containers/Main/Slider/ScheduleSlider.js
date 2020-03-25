import React, { Component} from "react";
import {Paper, Container} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import Slider from "react-slick";
import GameSlot from './GameSlot/GameSlot'
import cssClasses from './ScheduleSlider.module.css'
import {db} from '../../../Firebase'

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={className + " " + cssClasses.Arrow}
        style={{ ...style, display: "block" }}
        onClick={onClick}
        />
    );
}
  
function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={className + " " + cssClasses.Arrow}
        style={{ ...style, display: "block"}}
        onClick={onClick}
        />
    );
}


const styles = theme => ({    
})

class ScheduleSlider extends Component {
    _isMounted = false
    state = {
      matches : []
    }

    componentDidMount(){

      // var query = db.collection('player').where('teamID', "==", newState.hometeamID)
            
      // query.get().then(function(querySnapshot){
      //     let players = querySnapshot.docs.map(doc=>{
      //         return{
      //             id:doc.id,
      //             ...doc.data()
      //         }
      //     })

      //     this.setState({
      //         ...newState,
      //         homeplayers:players
      //     })

      // }.bind(this))

      this._isMounted = true

      db.collection('match').where('played','==',false).orderBy('date').orderBy('time').onSnapshot(snapshot => {
        const allMatch = snapshot.docs.map(doc => {
            // console.log(doc.data())
            return {
              hometeam : doc.data().hometeam,
              awayteam : doc.data().awayteam,
              time: doc.data().time,
              date: doc.data().date,
              place: doc.data().place
            }
        })

        // allMatch.reverse()
        if (this._isMounted){
          this.setState({matches:allMatch})
        }
        

      })
    }

    componentWillUnmount(){
      this._isMounted = false
    }

    render(){
        var matches = []

        if (this.state.matches.length > 0) {
          matches = this.state.matches.filter(match => {
            return match.date === this.state.matches[0].date
          })
        }


        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            lazyLoad:true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: matches.length < 3? matches.length : 3,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: matches.length < 2? matches.length : 2,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]
          };



        return (
          <Container>
            <Paper>
              <div className={cssClasses.Title}>Upcoming Matches</div>
              <Slider {...settings}>
                {matches.map((match, index) => {
                  return <GameSlot key={"match"+index} match={match} />
                })}
                {/* <div style={{height:"100%"}}>1</div>
                <div style={{height:"100%"}}>2</div>
                <div style={{height:"100%"}}>3</div>
                <div style={{height:"100%"}}>4</div> */}
              </Slider>
            </Paper>
          </Container>
        )
    }
}

export default withStyles(styles)(ScheduleSlider);