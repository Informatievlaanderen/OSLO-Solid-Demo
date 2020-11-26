import React, { useState, useEffect } from 'react'
import MiniDrawer from './MiniDrawer'

export default function HelpContainerComponent() {

  useEffect(() => {
    document.title = "Help - OSLO Solid Demo ";
  }, []);

  return (
    <div>
    <h1>{`${window.location}`}</h1>
    <MiniDrawer defaultview='help' sideBarItems={[]} topBarItems={[]} hidelogout={true}></MiniDrawer>
    </div>

  )
}
