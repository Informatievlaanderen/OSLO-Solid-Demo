import React, { useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { LoggedIn, LoggedOut } from '@solid/react'
import MiniDrawer from './Components/MiniDrawer'
function App () {


  useEffect(() => {
    document.title = "OSLO | Demo";
  }, []);


  return (
    <div className="App">
      <LoggedIn>
        <MiniDrawer defaultview='profile'/>
      </LoggedIn>
      <LoggedOut>
        <MiniDrawer defaultview='login' sideBarItems={['login', 'playground', 'divider', 'help', 'credits']} topBarItems={['help']} hidelogout={true}/>
      </LoggedOut>
    </div>
  )
}

export default App;
