import React, {useState} from 'react'
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyle = makeStyles({
    root: {
        width: '100%'
    }
})

const AdvancedDataEditorComponent = (props) => {
    const classes = useStyle();

    const handleDataChange = (event) => {
        props.onData(event.target.value);
    }

    return(
        <Row>
            <Col md={1}/>
            <Col md={11}>
                <TextareaAutosize onChange={handleDataChange} className={classes.root} aria-label="textarea" rowsMin={25} placeholder="Put your data snippet here" />
            </Col>
        </Row>
    )
}

export default AdvancedDataEditorComponent;
