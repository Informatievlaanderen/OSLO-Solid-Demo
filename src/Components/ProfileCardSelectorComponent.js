import React, { useState, useEffect } from 'react'

import Input from '@material-ui/core/Input';

import useProfile from '../hooks/useProfile'
import ProfileCardComponent from './ProfileCardComponent';
import { Row, Col } from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';

const ProfileCardSelectorComponent = (props) => {
  const [webIdInput, setWebIdInput] = useState(props.person.webId)

  const profile = useProfile(webIdInput)

  const webIdChangeHandler = (event) => {
    setWebIdInput(event.target.value)
    props.setvalue(event.target.value);
  }
  // useEffect(() => {
  //   if (profile && isProfile(profile)) props.setvalue(profile.webId);
  // }, [profile])

  const isComplete = (profile) => profile.name && profile.bdate && profile.location //&& profile.cstatus
  const isProfile = (profile) => profile.name

  const warningStyle = {
    color: 'red',
  };

  function getWarnings(profile) {
    if(!profile || !isProfile(profile)) return webIdInput ? "Please enter a valid webId" : undefined
    if (!isComplete(profile))
      return "The chosen profile is not complete. Please choose a webId with a completed profile, or wait for the profile to be completed by the owner."
  }

  const warnings = getWarnings(profile)

  return (
    <div id="ProfileCardSelectorComponent">
    {props.index < 2
      ? <Row className='propertyview ' key={"profileselect" + props.index}>
          <Col md={3}><label className="leftaligntext"><b>{props.person.label}</b></label></Col>
          <Col md={9}><Input className="leftaligntext" value={webIdInput || ""} name="location" onChange={webIdChangeHandler}/></Col>
        </Row>
      : <Row className='propertyview ' key={"profileselect" + props.index}>
          <Col md={3}><label className="leftaligntext"><b>{props.person.label}</b></label></Col>
          <Col md={8}><Input className="leftaligntext" value={webIdInput || ""} name="location" onChange={webIdChangeHandler}/></Col>
          <Col md={1}><ClearIcon onClick={() => props.delete(props.index)} /></Col>
        </Row>
      }
      {warnings && <b style={warningStyle}>{warnings}</b>}
      <Row className='propertyview ' key={"profileview" + props.index}>
        <Col md={3}></Col>
        <Col md={8}><ProfileCardComponent webId={webIdInput} key={webIdInput}></ProfileCardComponent></Col>
      </Row>
    </div>
  )
}

export default ProfileCardSelectorComponent
