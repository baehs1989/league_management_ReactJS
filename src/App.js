import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import PlayerList from './containers/Player/PlayerList/PlayerList'
// import DashboardWrapper from './HOC/DashboardWrapper'

import TeamList from './containers/Team/TeamList/TeamList'
import SchedulePage from './containers/Schedule/SchedulePage'

import Main from './containers/Main/Main';

import MyTeam from './containers/MyTeam/MyTeam'

import DashboardWrapperV2 from './HOC/DashboardWrapper/DashboardWrapperV2'

import Login from './containers/Auth/Login'

import {fb} from './Firebase'
import {db} from './Firebase'

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import Config from './containers/Config/Config'

import ForgotPassword from './containers/Auth/ForgotPassword'

import Test from './PDF/Test';

class App extends Component {

  state={
    authenticated:false,
    isLoading: true,
    admin: false,
    isEditable: false
  }



  componentDidMount(){
    fb.auth().onAuthStateChanged((authenticated) => {
      if(authenticated){
        db.collection('admin').where('email', '==', fb.auth().currentUser.email).onSnapshot(snapshot=>{
          const admin = snapshot.docs.map(doc=>{
            return {
              id: doc.id,
              email: doc.data().email,
              level: doc.data().level,
              editable: doc.data().editable
            }
          })

          console.log(admin)

          if (admin.length > 0){
            this.setState({authenticated:true, isLoading:false, admin:+admin[0].level===1, isEditable:admin[0].editable})
          }else{
            fb.auth().signOut();
            this.setState({authenticated:false, isLoading:false, admin:false, editable:false})
          }
          
        })
        
        
        
      }else{
        this.setState({authenticated:false, isLoading:false, adamin:false, editable:false})
      }

    });

  }

  updateAuthStatus = (status) =>{
    this.setState({authenticated:status})
  }

  handleLogout = () => {
    fb.auth().signOut().then(()=>{
      console.log("Signed Out")
      this.setState({admin:false, authenticated:false})
      window.location="/"
    }).catch(error=>{
      console.log(error)
    })
    
  }


  render (){
    return (
      <div className="App">
          <Backdrop open={this.state.isLoading} style={{zIndex:999999999}}>
              <CircularProgress color="inherit" />
          </Backdrop>

          {!this.state.admin?
            null
            :
            <Snackbar open={true} style={{opacity:'0.5'}}>
              <Alert severity="info">
                You are logged as Admin
              </Alert>
          </Snackbar>
          }


          <BrowserRouter>
            <DashboardWrapperV2 authenticated={this.state.authenticated} admin={this.state.admin} onLogout={this.handleLogout}>
              {!this.state.isLoading?
                <Switch>
                  <Route exact path="/" render={() => <Main/>}/>
                  <Route exact path="/teams" render={(props) => <TeamList {...props} {...this.state}/>}/>
                  <Route exact path="/players" render={(props) => <PlayerList {...props} {...this.state}/>}/>    
                  <Route exact path="/schedule" render={(props) => <SchedulePage {...props} {...this.state}/>}/>
                  {this.state.admin?
                    <Route exact path="/config" render={(props) => <Config {...props} {...this.state}/>}/>
                    :
                    <Route exact path="/myteam" render={(props) => <MyTeam {...props} {...this.state}/>}/>
                  }
                  <Route exact path="/login" render={(props) => <Login {...props} updateAuthStatus={this.updateAuthStatus} {...this.state}/>}/>
                  <Route exact path="/admin" render={(props) => <Login {...props} updateAuthStatus={this.updateAuthStatus} {...this.state}/>}/>
                  <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} updateAuthStatus={this.updateAuthStatus} {...this.state}/>}/>
                
                  <Route exact path="/test" render={(props) => <Test {...props} updateAuthStatus={this.updateAuthStatus} {...this.state}/>}/>

                </Switch>
                :
                null
              }
            </DashboardWrapperV2>
          </BrowserRouter> 
      </div>
    );
  }
}

export default App