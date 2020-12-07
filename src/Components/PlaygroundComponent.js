import React, {useState} from "react";
import {Col, Row} from "react-bootstrap";
import BasicDataEditorComponent from "./BasicDataEditorComponent";
import ListAltIcon from '@material-ui/icons/ListAlt';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import Switch from "@material-ui/core/Switch";
import withStyles from "@material-ui/core/styles/withStyles";
import AdvancedDataEditorComponent from "./AdvancedDataEditorComponent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "react-bootstrap/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {LoggedOut, LoggedIn} from "@solid/react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DataUploadComponent from "./DataUploadComponent";

const SHACL_ENDPOINT = 'https://test.data.vlaanderen.be/shacl-validator-backend/shacl/applicatieprofielen/api/validate'
const SHACL_SHAPE = 'persoon_basis'

const CustomSwitch = withStyles({
    switchBase: {
        color: '#0066cc',
        '&$checked': {
            color: '#0066cc',
        },
        '&$checked + $track': {
            backgroundColor: '#0066cc',
        },
    },
    checked: {},
    track: {},
})(Switch);

const useStyle = makeStyles({
    root: {
        width: '100%'
    }
})

const PlaygroundComponent = (props) => {
    const [checked, setChecked] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(localStorage.getItem('snippet') || null);
    const [shaclResult, setShaclResult] = useState(null);

    const classes = useStyle();

    const handleChange = event => {
        setChecked(event.target.checked);
    }

    const handleDataFromChild = (update) => {
        setData(update);
    }

    const validateData = () => {
        if (data) {
            setError(null);
            const body = JSON.stringify({
                contentToValidate: new Buffer(JSON.stringify(data)).toString('base64'),
                embeddingMethod: "BASE64",
                contentSyntax: 'application/ld+json',
                validationType: SHACL_SHAPE,
                reportSyntax: 'text/turtle'
            });

            fetch(SHACL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }).then(result => {
                const decoder = new TextDecoder('utf-8');
                const reader = result.body.getReader();
                reader.read().then(({value, done}) => {
                    setShaclResult(decoder.decode(value));
                });
            }).catch( err => {
                console.log(err);
            })
        } else {
            setError("No data was provided. Please create a snippet in order to validate it.");
        }

    }

    const warningStyle = {
        color: 'red',
    };

    const saveToLocalStorage = () => {
        if (data) {
            localStorage.setItem('snippet', JSON.stringify(data));
        }
    }

    const deleteFromLocalStorage = () => {
        localStorage.removeItem('snippet');
    }


    return (
        <div className='container leftaligntext'>
            <h3 className='container centeraligntext'>Creating OSLO compliant data</h3>

            <br/>
            <Row>
                <Col md={1}><ListAltIcon/></Col>
                <Col md={11}><h4>Step 1 — JSON-LD</h4></Col>
            </Row>
            <Row>

                <Col md={1}></Col>
                <Col md={11}>
                    <p>Now that you know what a vocabulary, an application profile and implementaiton model stands for,
                        it is your turn!</p>
                    <p>In this step, you are going to create a JSON-LD data snippet that is compliant with the
                        implementation model shown on the slides.
                        There are 2 possibilities in order to create the data snippet.
                    </p>
                    <p>
                        First, for people who are not familiar with JSON-LD, there is the basic version. For this demo,
                        we recommend to use this possibilty.
                    </p>
                    <p>
                        For people that have some or much experience with JSON-LD, there is the advanced version. We
                        challenge them to use the <a target='_blank' href='https://json-ld.org/playground/'>JSON-LD
                        playground</a>. Once you are done with creating the data snippet in the JSON-LD playground, copy
                        & past it in the textarea below.
                    </p>
                    <h5>Tips</h5>
                    <p>
                        To generate a WKT string, <a target='_blank'
                                                     href='https://clydedacruz.github.io/openstreetmap-wkt-playground/'>this
                        site</a> can help. Click on the <button type="button"
                                                                className="btn btn-primary"
                                                                style={{width: '120px'}}> Clear </button>. Then click on
                        the <button type="button"
                                    className="btn btn-primary"
                                    style={{width: '120px'}}> Point </button> in order to select a point. Then navigate to your birth place on the map and click it. Normally you should see a WKT string in the textarea below the map.
                        When working with the basic version, copy the WKT string and paste it in the WKT field.
                    </p>
                    <h5>Spoiler</h5>
                    <p>
                        The basic version contains already most of the answer. Try not to cheat if you are
                        working with the advanced version.
                    </p>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <FormControlLabel
                        control={
                            <CustomSwitch
                                checked={checked}
                                onChange={handleChange}
                                name="playgroundSwitch"
                            />
                        }
                        label={checked ? 'Advanced' : 'Basic'}
                    />
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    {checked ? <AdvancedDataEditorComponent onData={handleDataFromChild}/> :
                        <BasicDataEditorComponent onData={handleDataFromChild}/>}
                </Col>
            </Row>
            <br/>
            <Row>
                <Col md={1}><DoneIcon/></Col>
                <Col md={11}><h4>Step 2 — Validation</h4></Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <p>Now that you have your data snippet, it is time to validate it.</p>
                    <p>For each OSLO application profile, an additional SHACL file is generated which contains the
                        constraints for the corresponding data model. This enables us to verify if our data is OSLO
                        compliant.</p>
                    <p>It would take a lot of work to do this manually and therefore we have the OSLO Validator. You can
                        visit the validator <a href='https://data.vlaanderen.be/shacl-validator/'>here</a>. The cool
                        thing is that
                        our validator has a REST API, so you can validate your data against the OSLO application
                        profiles in your own application!</p>
                </Col>
            </Row>
            {error && <Row><Col md={1}/><Col md={11}><b style={warningStyle}>{error}</b></Col></Row>}
            <br/>
            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <Button onClick={validateData}>Validate</Button>
                </Col>
            </Row>
            <br/>
            {shaclResult ?
                <Row>
                    <Col md={1}/>
                    <Col md={11}>
                        <TextareaAutosize value={shaclResult} className={classes.root} aria-label="textarea"
                                          rowsMin={10}/>
                    </Col>
                </Row>
                :
                <br/>

            }
            <Row>
                <Col md={1}><PublishIcon/></Col>
                <Col md={11}><h4>Step 3 — Temporarily store data in local storage</h4></Col>
            </Row>
            <Row>
                <Col md={1}/>
                <Col md={11}>
                    <p>In the rest of this tutorial we are going to learn about Solid, your own data vault.</p>
                    <p>Since you don't have your own data vault, we suggest to store your data snippet in local
                        storage, awaiting your Solid Pod</p>
                </Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                <Col md={11}>
                    <ButtonGroup aria-label="Basic example">
                        <Button onClick={saveToLocalStorage} variant="primary">Save to local storage</Button>
                        <Button onClick={deleteFromLocalStorage} variant="danger">Delete from local storage</Button>
                    </ButtonGroup>
                </Col>
            </Row>

        </div>
    );
}

export default PlaygroundComponent;
