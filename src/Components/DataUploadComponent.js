import React, {useEffect, useState} from 'react';
import {parseURL} from 'url-toolkit';
import {Col, Row} from "react-bootstrap";
import {Input} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";
import Button from "react-bootstrap/Button";
import Alert from '@material-ui/lab/Alert';
import makeStyles from "@material-ui/core/styles/makeStyles";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {uploadDataSnippet} from "../util/Util";
import PublishIcon from "@material-ui/icons/Publish";
import {LoggedIn} from "@solid/react";
import {putFile} from "../util/FileUtil";
import { Parser } from "n3";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import {quadListToTTL} from "../util/QueryUtil";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const useStyle = makeStyles({
    root: {
        width: '100%'
    }
});

const DataUploadComponent = (props) => {
    const classes = useStyle();
    const [data, setData] = useState(localStorage.getItem('snippet') || null);
    const [turtle, setTurtle] = useState('');
    const parsedURI = parseURL(props.webId)
    const [storageLocation, setStorageLocation] = useState(parsedURI.scheme + parsedURI.netLoc + '/public/');
    const [warning, setWarning] = useState(null);

    const ParserJsonld = require('@rdfjs/parser-jsonld');
    const Readable = require('stream').Readable;


    useEffect( () => {
        if(!data){
            setWarning("The snippet can not be found at local storage. Did you upload it? ");
            return;
        }

        const snippet = data;
        snippet['@id'] = props.webId;
        const parser = new ParserJsonld();
        const input = new Readable({
            read: () => {
                input.push(JSON.stringify(snippet));
                input.push(null);
            }
        });
        const output = parser.import(input);
        let quads = [];
        output.on('data', quad => {
            quads.push(quad);
        });

        output.on('end', () => {
            quadListToTTL(quads).then(ttl => {
                setTurtle(ttl);
            });
        })
    }, [data]);

    const warningStyle = {
        color: 'red',
    };


    const uploadToPod = () => {
        const snippetId = storageLocation + 'person.ttl';
        putFile(snippetId, turtle).then( () => {
            localStorage.removeItem('snippet');
        });
    }

    const updateStorageLocation = (e) => {
        setStorageLocation(e.target.value)
    }

    return (
        <div className="container leftaligntext">
            <Row className="container centeraligntext">
                <Col md={1}/>
                <Col md={11}><h4>Upload data to Solid Pod</h4></Col>
            </Row>
            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <p>Now that you have your own Solid Pod, let's store your data snippet in there. First, load the data back in from the local storage and then upload it!</p>
                    <p>At the moment, Solid is most familiar with the data format Turtle, therefore we convert our JSON-LD to Turtle which is visible in the textarea below. If you take a close look at the transformed data,
                    you will see that the RDF structure, triples, are more clear in this format.</p>
                    <p>Let's hit the upload button and get on with this tutorial!</p>
                </Col>
            </Row>
            <br/>
            {warning && <Row><Col md={1}/><Col md={11}><b style={warningStyle}>{warning}</b></Col></Row>}
            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <TextareaAutosize className={classes.root} rowsMin={15} value={turtle}/>
                </Col>
            </Row>
            <br/>
            <Row className='propertyview'>
                <Col md={1}/>
                <Col md={2}><label className='leftaligntext'>{"Storage Location"}</label></Col>
                <Col md={8}><Input className='storageLocation leftaligntext' value={storageLocation}
                           onChange={updateStorageLocation}/></Col>
            </Row>
            <br/>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <Button onClick={uploadToPod}>Upload to Solid Pod</Button>
                </Col>
            </Row>
        </div>
    )
}

export default DataUploadComponent;

