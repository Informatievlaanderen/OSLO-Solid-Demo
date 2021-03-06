import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { Value } from '@solid/react';

import ns from "../util/NameSpaces"
import useContracts from '../hooks/useContracts'
import { availableViews, formatDate } from '../util/Util'

const InProgressViewerComponent = (props) => {

  const userContracts = useContracts(props.webId) || []
  const contracts = userContracts.filter(e => !e.status || e.status === ns.demo('proposal') || e.status === ns.demo('submitted') || e.status === ns.demo('rejected'))

  const viewMarriage = function(contract){
    const view = availableViews.friendshipview;
    view.args = {contractId: contract.id}
    props.setview(view)
  }

  const getContractStatus = (status) => {
    if(!status) return('pending')
    const split = status.split('/')
    return split[split.length - 1]
  }

  const getContractDate = (date) => {
    if (!date) {
      return "no date set"
    } else {
      return new Date(date).toLocaleString()
    }
  }

  const sortedContracts = contracts.sort( (a, b) => { if(!b) { return a } else if (!a) { return b } else { return new Date(a.created) - new Date(b.created) }})
  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4>Running Friend Requests</h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={3}><label className="leftaligntext"><b>Contract type</b></label></Col>
        <Col md={2}><label className="leftaligntext">Current status</label></Col>
        <Col md={2}><label className="leftaligntext">Created at</label></Col>
        <Col md={3}><label className="leftaligntext">Creator</label></Col>
        <Col md={2}><label className="centeraligntext">Action</label></Col>
      </Row>
      {sortedContracts.map(contract => {
        return (
          <Row className='propertyview ' key={contract.id}>
            <Col md={3}><label className="leftaligntext"><b>friend request</b></label></Col>
            <Col md={2}><label className="leftaligntext">{getContractStatus(contract.status)}</label></Col>
            <Col md={2}><label className="leftaligntext">{getContractDate(contract.created)}</label></Col>
            <Col md={3}><label className="leftaligntext"><a href={contract.creator}><Value src={`[${contract.creator}].name`}/></a></label></Col>
            <Col md={2}><Button onClick={() => viewMarriage(contract)} className='centeraligntext'>see progress</Button></Col>
          </Row>
        )
      })}

    </div>
  )
}

export default InProgressViewerComponent
