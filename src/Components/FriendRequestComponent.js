import React, {useState, useEffect} from 'react'
import '../css/VCardComponent.css'

// import { useForm, Controller } from 'react-hook-form'
import { Button, Row, Col } from 'react-bootstrap'
import ProfileCardSelectorComponent from './ProfileCardSelectorComponent'
import { createMarriagePropsalNotification } from '../util/QueryUtil'
import { Input } from '@material-ui/core'
import { parseURL } from 'url-toolkit';
import { getProfile } from '../hooks/useProfile'
import { availableViews, getProfileData } from '../util/Util'
import {createFriendRequest} from "../util/FriendsController";

const FriendRequestComponent = (props) => {

    const parsedURI = parseURL(props.webId)
    const [storageLocation, setStorageLocation] = useState(parsedURI.scheme + parsedURI.netLoc + '/public/')
    const [state, setState] = useState([
        {
            label: "Person",
            type: "person",
            webId: props.webId,
        },
        {
            label: "Person",
            type: "person",
            webId: "",
        }
    ])

    const handleSubmit = async event => {
        if (!await validateSubmission(state)) return;
        const proposal = await createFriendRequest(state, storageLocation, props.webId)
        props.setview(availableViews.running)
    }

    const setvalue = (index, value) => {
        const stateCopy = state.slice()
        stateCopy[index].webId = value
        setState(stateCopy)
    }

    const validateSubmission = async () => {

        if (state.filter(person => person.type === 'person').length <= 1){
            window.alert('Please provide the webId of the person you want to be friends with.')
            return false;
        }

        for (let person of state){
            if (!person.webId) {
                window.alert(person.label + ' field does not have a valid webId');
                return false
            }

            const profile = await getProfileData(person.webId)
            if (!profile || !profile.name) {
                window.alert(person.webId + ' is not a valid webId');
                return false
            } else if (!profile.bdate || !profile.location) {
                window.alert(person.webId + ' does not have a valid profile');
                return false
            }
        }
        return true;
    }

    const updateStorageLocation = (e) => {
        setStorageLocation(e.target.value)
    }


    return (
        <div id='FriendRequestComponent' className='container'>
            <h4>Construct Friend Request</h4>
            <br />
            <Row className='propertyview pageheader' key={'header'}>
                <Col md={3}><label className="leftaligntext"><b>Function</b></label></Col>
                <Col md={9}><label className="leftaligntext">Person webId</label></Col>
            </Row>
            <form>
                {state.map((person, index) => {
                    return ( <ProfileCardSelectorComponent setvalue={(value) => setvalue(index, value)} person={person} key={'cardselector' + index} index={index} /> )
                })}
                <br/>
                <br/>
                <Row className='propertyview'>
                    <Col md={3}><label className='leftaligntext'>{"Storage Location"}</label></Col>
                    <Col md={9}><Input className='storageLocation leftaligntext' value={storageLocation} onChange={updateStorageLocation}/></Col>
                </Row>
                <Button onClick={() => handleSubmit()}>Submit</Button>
            </form>
        </div>
    )
}

export default FriendRequestComponent;
