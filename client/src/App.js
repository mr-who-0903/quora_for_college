import React from 'react'
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Quora from './components/Quora';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Logout from './components/Logout';

const Routing = () =>{
  return(
      <Switch>
          <Route exact path='/' component={Quora} /> 
          <Route exact path='/signin' component={Signin} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/logout' component={Logout} />
      </Switch>
  )
}

function App() {

  return (
    <>
      <Routing/>
    </>
  );
}

export default App;
