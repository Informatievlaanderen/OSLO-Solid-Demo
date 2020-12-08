import React from 'react'
import {Row, Col, Button, Badge} from 'react-bootstrap'
import {availableViews} from '../util/Util';
import {IconButton} from '@material-ui/core';

const HelpComponent = (props) => {
    return (
        <div id="HelpComponent" className='container leftaligntext'>
            <h4 className='container centeraligntext'>How to get friends with SOLID in a few clicks</h4>

            <Row>
                <Col md={1}>{availableViews.login.icon}</Col>
                <Col md={11}><h4>Preliminaries</h4></Col>
            </Row>
            <Row>

                <Col md={1}></Col>
                <Col md={11}>
                    <p>Before starting this demonstration for SOLID, you are expected to create a SOLID pod.</p>
                    <p>In case you do not do not yet have a SOLID pod available, you can create a pod on <a
                        href={'https://inrupt.net/'}>solid community</a>.</p>
                    <p>(or using login button - choose provider - register account. But this should be explained with
                        pictures)</p>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md={1}>{availableViews.profile.icon}</Col>
                <Col md={11}><h4>Step 1 - Complete user profile</h4></Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <p>The first step of this demonstration is to fill out your profile information.</p>
                    <p>This ensures that subsequent steps in the demonstration can retrieve some information from your
                        pod to show in the forms.</p>
                    <p>You can find (some of) your profile information in the profile tab on the left.</p>
                    <p>In this tab, you can edit your profile information by clicking the <Button>Edit</Button> button.
                    </p>
                    <p>In the edit screen, you can fill in your profile information in the fields, and submit the using
                        the <Button type="submit">Submit</Button> button.</p>
                    <p>All fields are mandatory!</p>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md={1}>{availableViews.upload.icon}</Col>
                <Col md={11}><h4>Step 2 - Upload your data snippet</h4></Col>
            </Row>

            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <p>Upload your data snippet that you created earlier this tutorial.</p>
                    <p>When you forgot to store your snippet at local storage, the application will show an error and you will have to create the snippet again</p>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md={1}>{availableViews.friendrequest.icon}</Col>
                <Col md={11}><h4>Step 3 - Sending a friend request</h4></Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <p>Now that your profile information is completed, you can send out friend request</p>
                    <p>To send a friend request, go to the <b>Friend request</b> tab</p>
                    <p>You will see a form, where your information is already filled out, as one of the 2 persons
                        engaging this friendship</p>
                    <p>Since a friendship requires 2 persons, you will have to find another person's webId to enter</p>
                    <p>If a valid webId is entered, the associated profile will be shown automatically</p>
                    <p>In case this profile is incomplete, an error message will be shown. Please choose a different
                        webId, or wait for the person to complete their profile.</p>
                    <p>If all necessary information is filled in, the request is ready to be submitted.</p>
                    <p>You can use the default storage location to store the created friend request on your pod, or
                        select a custom location (please make sure the selected location is valid, and read permissions
                        are public. If this is not the case, the people you invite will not be able to see the friend request).</p>
                    <p>Now, you can submit the friend request using <Button>Submit</Button></p>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md={1}>{availableViews.running.icon}</Col>
                <Col md={11}><h4>Step 4 - Accepting requests</h4></Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <p>On creation of a friend request, all parties (including yourself) are notified of the created
                        friend request.</p>
                    <p>These notifications can be found by clicking the notification icon
                        <IconButton aria-label={'notifications'} color="inherit">
                            <Badge color="secondary">
                                {availableViews.notifications.icon}
                            </Badge>
                        </IconButton>
                        at the top of your screen.</p>
                    <p>Now, you can see the friend request, and the other person involved in the friend request.</p>
                    <p>In this form, you will see two action buttons next to your name: <button type="button"
                                                                                                className="marriageview_accept__3V0c_ centeraligntext btn btn-primary"
                                                                                                style={{width: '120px'}}> Accept </button> and <button
                        type="button" className="marriageview_refuse__2lqar centeraligntext btn btn-primary"
                        style={{width: '120px'}}> Refuse </button>.
                    </p>
                    <p>With these, you can accept or refuse the request.</p>
                    <p>For the creator of a friend request, a button is available to resend an invitation. This will
                        trigger another notification to be sent to the person.</p>
                    <p>When everyone has accepted the request, a button <button type="button"
                                                                                className="marriageview_accept__3V0c_ valuebutton btn btn-primary"
                                                                                style={{width: '220px'}}> Officiate
                        Friend Request </button> is available for the creator of the friend request to make the new
                        friendship official (status of the friend request will be updated to 'official')
                    </p>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md={1}>{availableViews.friendoverview.icon}</Col>
                <Col md={11}><h4>Step 5 - Viewing your friend request</h4></Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <p>When the friendship is offical, you can view the information of your new friend and also the
                        friend request in this tab</p>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md={1}>{availableViews.map.icon}</Col>
                <Col md={11}><h4>Step 6 - Your friends on a map</h4></Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <p>When a friend request is accepted, the snippet that was made with the playground will be read</p>
                    <p>The location the person provided as his birth place, will be used to show a marker on the map</p>
                </Col>
            </Row>
            <br/>
        </div>
    )
}

export default HelpComponent
