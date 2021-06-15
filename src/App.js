import { useContext, useEffect } from 'react';
import './App.css';
import Messenger from './components/messenger/Messenger';
import Login from './components/login/Login';
import { UserContext, UserContextProvider } from './context/UserContext';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function App() {
  const {loggedUser, setLoggedUser} = useContext(UserContext);
  useEffect(() => {
    const getUser = window.localStorage.getItem('loggedUser');
    setLoggedUser(JSON.parse(getUser));
  },[])
  return (
      <>
        <Router>
          <Switch>
            <Route exact path='/' render={() => {
              return(
                loggedUser ? 
              <Redirect to='/chattyApp' /> : 
              <Redirect to='/login' />
              )
            }} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/chattyApp' render={() => {
              return(
                loggedUser ? 
                  <div className="App">
                    <h3 style={{color:'white'}} className='App_mess'>Welcome to Chatty App <span className='userName'>{loggedUser ? loggedUser.name : ''}</span> </h3>
                      <Messenger />
                  </div> : 
              <Redirect to='/login' />
              )
            }} />
          </Switch>
        </Router>
      </>
  );
}

export default App
// {
//   loggedUser ? (
//     <div className="App">
//       <h3 style={{color:'white'}} className='App_mess'>Welcome to Chatty App {loggedUser.displayName} </h3>
//       <Route path='/chattyApp'>
//         <Messenger />
//       </Route>
//     </div>
//   ) : (
//     <>
//     <Route path='/' exact>
//       <Login />
//     </Route>
//     </>
//   )
// }