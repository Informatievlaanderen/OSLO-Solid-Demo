import React, {useEffect, useState} from "react";
import {availableViews} from "../util/Util";
import {Col, Row} from "react-bootstrap";
import ProfileCardComponent from "./ProfileCardComponent";
import {getFriends} from "../util/FriendsController";
import useContracts from "../hooks/useContracts";

const {default: data} = require('@solid/query-ldflex');


const FriendsOverviewComponent = (props) => {
    const userContracts = useContracts(props.webId);
    const friends = getFriends(userContracts, props.webId);

    async function viewrequest(requestId) {
        // const contract = await getContractData(marriageId)
        const view = availableViews.friendshipview
        view.args = {contractId: requestId}
        props.setview(view)
    }

    return (
        <div className="container">
            <h4>Friends overview</h4>
            <br/>
            <Row className='propertyview pageheader' key={'header'}>
                <Col md={6}><label className="leftaligntext"><b>Friend Request ID</b></label></Col>
                <Col md={6}><label className="leftaligntext">Friend</label></Col>
            </Row>
            {friends.map((friend, index) => {
                return (
                    <Row className='propertyview' key={friend.id + '-' + index}>
                        <Col md={6}><label className="leftaligntext"><a href={friend.contractId} target="_blank">View
                            request snippet</a></label></Col>
                        <Col md={6}><ProfileCardComponent webId={friend.person.id} key={friend.person.id}/></Col>
                    </Row>
                )
            })}

        </div>
    )
}

export default FriendsOverviewComponent
