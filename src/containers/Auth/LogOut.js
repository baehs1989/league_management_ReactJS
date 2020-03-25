import React from 'react';
import {fb} from '../../Firebase';

const logOutUser = () => {
 fb.auth().signOut();
};
const LogOut = () => {
 return <button onClick={logOutUser} children="Log Out" />;
};
export default LogOut;