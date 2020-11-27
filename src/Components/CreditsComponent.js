import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const idlablogo = require('../assets/idlablogo.jpg');

const CreditsComponent = (props) => {
    return(
        <div className='container leftaligntext'>
            <h4 className='container centeraligntext'>This demo was inspired by the demo developed by IDLab</h4>

            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <p>This OSLO-Solid demo is a spin-off of the original demo, developed by <a target='_blank' href='https://www.ugent.be/ea/idlab/en'>IDLab</a>. They managed to create a demo where you can get married with Solid!</p>
                    <p>Follow <a target='_blank' href='https://github.com/IDLabResearch/Solid-Marriage-Demo'>this link</a> to have a look at their demo</p>
                </Col>
            </Row>
            <Row className='centeraligntext'>
                <Col md={1}/>
                <Col md={11}>
                    <img src={idlablogo}/>
                </Col>
            </Row>
        </div>
    )
}

export default CreditsComponent;
