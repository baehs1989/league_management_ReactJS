import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {fb} from '../../Firebase';
import Container from '@material-ui/core/Container';

class Register extends Component {
 state = {
   email: '',
   password: '',
   error: null,
 };
handleInputChange = (event) => {
   this.setState({ [event.target.name]: event.target.value });
 };
handleSubmit = (event) => {
   event.preventDefault();
   const { email, password } = this.state;

    fb
     .auth()
     .createUserWithEmailAndPassword(email, password)
     .then((user) => {
       this.props.history.push('/');
     })
     .catch((error) => {
       this.setState({ error: error });
     });
 };

 render() {
   const { email, password, error } = this.state;
   return (
     <Container>
       <div>
         <div>
           <h1>Register</h1>
         </div>
       </div>
       {error ? (
         <div>
           <div>
             <span>{error.message}</span>
           </div>
         </div>
       ) : null}

       <div>
         <div>
           <form onSubmit={this.handleSubmit}>
             <input type="text" name="email" placeholder="Email" value={email} onChange={this.handleInputChange} />
             <input
               type="password"
               name="password"
               placeholder="Password"
               value={password}
               onChange={this.handleInputChange}
             />
             <button children="Register" />
           </form>
         </div>
       </div>
     </Container>
   );
 }
}
export default withRouter(Register);