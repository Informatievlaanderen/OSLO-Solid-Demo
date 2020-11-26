import React, { useState, useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import styles from '../css/components/friendshipview.module.css'

import ns from "../util/NameSpaces"
import ProfileCardComponent from './ProfileCardComponent'
import {
  acceptRequest,
  refuseRequest,
  deleteRequest,
  sendContactInvitation,
  officiateRequest
} from '../util/FriendsController'
import { availableViews, getContractData } from '../util/Util';
const { default: data } = require('@solid/query-ldflex');

const INVITATIONACCEPTED = ns.demo('accepted')
const INVITATIONREFUSED = ns.demo('refused')

const TIMEOUT = 10 * 1000;

// TODO:: remove marriage button only for creator
// TODO:: If spouse if 2 times the same person it will only show once (same for witnesses) because of ldflex => update this to use N3 in usecontracts?

/**
 *
 * @param {spouse: {id: string}[], witness: {id: string}[]} props.contacts
 */
const FriendshipViewComponent = (props) => {

  const [contract, setcontract] = useState(undefined);
  let allcontacts = [];
  if (contract){
    allcontacts =  contract.person.map(e => { e.type='person'; return e})
    allcontacts = allcontacts.map(e => { e['status'] = e['status'] || 'loading' ; return e})
  }
  const [contacts, setContacts] = useState(allcontacts)

  // Load in contract data
  useEffect(() => {
    let mounted = true
    getContractData(props.contractId).then(contract => {
      if (mounted) setcontract(contract || null)
    })
    return () => mounted = false;
  }, [props.contractId])

  // Set contacts status
  useEffect(() => {
    if (!contract) return;
    let mounted = true
    async function refreshContacts() {
      updateContacts(allcontacts).then(updatedContacts => {
        if(mounted) setContacts(updatedContacts)
      })
    }
    refreshContacts()
    const interval = setInterval(() => {
      refreshContacts()
    }, TIMEOUT);
    return () => {
      mounted = false;
      clearInterval(interval);
    }
  }, [contract])

  async function getContactStatus(contactWebId){
    let accepted, refused;
    data.clearCache() // data.clearCache(contactWebId)
    for await (const acceptedEvent of data[contactWebId][INVITATIONACCEPTED]){
      if (`${await acceptedEvent}` === props.contractId) accepted = true;
    }
    for await (const refusedEvent of data[contactWebId][INVITATIONREFUSED]){
      if (`${await refusedEvent}` === props.contractId) refused = true;
    }
    return accepted ? 'accepted' : (refused ? 'refused' : 'pending')
  }

  async function updateContacts(contactsToUpdate) {
    const contacts = []
    for (let contact of contactsToUpdate){
      contact['status'] = await getContactStatus(contact.id)
      contacts.push(contact)
    }
    return contacts
  }

  async function officiateFriendship(){
    const submission = officiateRequest(props.webId, props.contractId, contacts);
    props.setview(availableViews.running)
  }

  async function deleteFriendRequest(){
    const deletion = await deleteRequest(props.contractId, props.webId)
    props.setview(availableViews.running)
  }

  function isComplete() {
    for (let contact of contacts) {
      if (contact.status !== "accepted") return false
    }
    if (contract.status === ns.demo('rejected')) return false
    return true
  }

  function setContactStatus(contactId, newstatus){
    let updatedContacts = contacts.slice()
    for (let contact of updatedContacts) {
      if (contact.id === contactId) {
        contact.status = newstatus;
      }
    }
    setContacts(updatedContacts)
  }

  async function accept(contactId, contractId) {
    const response = await acceptRequest(props.webId, props.contractId, contract.creator)
    setContactStatus(contactId, 'accepted')
  }

  async function refuse(contactId, contractId) {
    await refuseRequest(props.webId, props.contractId, contract.creator)
    setContactStatus(contactId, 'refused')
  }

  async function resend(contactId, proposalId) {
    const response = await sendContactInvitation(props.webId, contactId, proposalId)
  }

  function getContactButton(contact){
    if(contact.status === 'pending') {
      // If me
      if (contact.id === props.webId) return (
          <div>
            <Button className={`${styles.accept} centeraligntext`} onClick={() => accept(contact.id, props.contractId)}> Accept </Button>
            <Button className={`${styles.refuse} centeraligntext`} onClick={() => refuse(contact.id, props.contractId)}> Refuse </Button>
          </div>
        )
      else {
        return (
            <ResendButton resend={resend} contactId={contact.id} contractId={props.contractId}/>
        )
      }
    }
    return(<div />)
  }

  function showContactStatus(contact){
    switch (contact.status) {
      case 'accepted':
        return "Accepted"
      case 'refused':
        return "Refused"
      case 'loading':
        return "Loading"
      case 'pending':
        return "Pending"
    }
    return "Loading"
  }


  if (contract === undefined) {
    return (
      <div className='container'>
        <h4> Friend Request </h4>
        <br />
        <h6>Loading Friend Request.</h6>
      </div>
    )
  } else if (!contract) {
    return (
      <div className='container'>
        <h4> Friend Request </h4>
        <br />
        <h6>The requested friend request could not be retrieved. The resource has been removed or does not exist.</h6>
      </div>
    )
  }
  return (
    <div className='container'>
      <h4> Friend Request </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={2}><label className="leftaligntext"><b>Function</b></label></Col>
        <Col md={5}><label className="leftaligntext">Person webId</label></Col>
        <Col md={2}><label className="centeraligntext">Status</label></Col>
        <Col md={2}><label className="centeraligntext">Action</label></Col>
      </Row>
      {contacts.map((contact, index) => {
        return (
          <Row className='propertyview' key={contact.id + '-' + index}>
            <Col md={2}><label className="leftaligntext"><b>{contact.type}</b></label></Col>
            <Col md={5}><ProfileCardComponent webId={contact.id} key={contact.id} /></Col>
            <Col md={2}>{showContactStatus(contact)}</Col>
            <Col md={2}>{getContactButton(contact)}</Col>
          </Row>
        )})}
        <br />
        <br />
        <br />
        { contract.creator === props.webId && contract.status !== ns.demo('official')
          ? isComplete()
            ? <Row>
                <Col md={6} />
                <Col md={3}>
                  <Button className={`${styles.accept} valuebutton`} onClick={() => officiateFriendship(props.contractId, props.webId)}> Officiate Friend Request </Button>
                </Col>
                <Col md={3}>
                  <Button className={`${styles.delete} valuebutton`} onClick={() => deleteFriendRequest(props.contractId, props.webId)}> Delete Friend Request </Button>
                </Col>
              </Row>
            : <Row>
                <Col md={9} />
                <Col md={3}>
                  <Button className={`${styles.delete} valuebutton`} onClick={() => deleteFriendRequest(props.contractId, props.webId)}> Delete Friend Request </Button>
                </Col>
              </Row>
          : <Row />
        }
    </div>
  )
}
export default FriendshipViewComponent;

const ResendButton = (props) => {
  const [state, setstate] = useState(false)
  if (state) return (<Button className={`${styles.pending} centeraligntext`} disabled>Reminder sent</Button>)
  return (<Button className={`${styles.pending} centeraligntext`} onClick={() => { props.resend(props.contactId, props.contractId).then(setstate(true)) }} >Resend notification</Button>)
}
