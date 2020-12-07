import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";

const BasicDataEditorComponent = (props) => {
    const template = require('../util/ApplicationProfileTemplate.json');

    const [gender, setGender] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [name, setName] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [birthDate, setBirthDate] = React.useState('');
    const [birthPlace, setBirthPlace] = React.useState('');
    const [birthCountry, setBirthCountry] = React.useState('');
    const [wkt, setWkt] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('');

    const handleGenderChange = (event) => {
        setSelectedOption(event.target.value);
        let value = '';
        switch (event.target.value) {
            case "M":
                value =
                    "http://publications.europa.eu/resource/authority/human-sex/MALE";
                break;
            case "V":
                value =
                    "http://publications.europa.eu/resource/authority/human-sex/FEMALE";
                break;
            case "X":
                value =
                    "http://publications.europa.eu/resource/authority/human-sex/NAP";
                break;
        }
        setGender(value);
        template["geslacht"]["@id"] = "<span style='background-color: #0066cc;color:white!important;'>" + value + "</span>";
    };

    const handleSurnameChange = (event) => {
        setSurname(event.target.value);
        template["voornaam"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>";
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
        template["achternaam"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>"
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
        template["volledigeNaam"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>"
    };

    const handleBirthDateChange = (event) => {
        setBirthDate(event.target.value);
        template["heeftGeboorte"]["datum"]["@value"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>";
    };

    const handleBirthPlaceChange = (event) => {
        setBirthPlace(event.target.value);
        template["heeftGeboorte"]["plaats"]["plaatsnaam"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>"
    };

    const handleBirthCountryChange = (event) => {
        setBirthCountry(event.target.value);
        template["heeftGeboorte"]["land"]["plaatsnaam"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>"
    };

    const handleWktChange = (event) => {
        setWkt(event.target.value);
        template["heeftGeboorte"]["plaats"]["geometrie"]["Geometrie.wkt"] = "<span style='background-color: #0066cc;color:white!important;'>" + event.target.value + "</span>"
    };

    const handleFocusLoss = async () => {
        await fillIntemplate();
        props.onData(template);
    }

    const fillIntemplate = () => {
        template['voornaam'] = surname;
        template['achternaam'] = name;
        template['volledigeNaam'] = fullName;
        template["geslacht"]["@id"] = gender;
        template['heeftGeboorte']['datum']['@value'] = birthDate;
        template['heeftGeboorte']['plaats']['plaatsnaam'] = birthPlace;
        template['heeftGeboorte']['land']['plaatsnaam'] = birthCountry;
        template['heeftGeboorte']['plaats']['geometrie']['Geometrie.wkt'] = wkt;
    }

    const handleChange = () => {

    }

    return (
        <div>
            <Row>
                <Col md={1}/>
                <Col md={3}>
                    <form>
                        <div>
                            <TextField onBlur={handleFocusLoss} value={surname} required id="surname" label="Voornaam" onChange={handleSurnameChange}/>
                        </div>
                        <br/>
                        <div>
                            <TextField onBlur={handleFocusLoss} value={name} required id="name" label="Achternaam" onChange={handleNameChange}/>
                        </div>
                        <br/>
                        <div>
                            <TextField onBlur={handleFocusLoss} value={fullName} required id="full-name" label="Volledige naam" onChange={handleFullNameChange}/>
                        </div>
                        <br/>
                        <div>
                            <FormLabel required component="legend">Geslacht</FormLabel>
                            <RadioGroup onBlur={handleFocusLoss} required row aria-label="gender" name="gender" value={selectedOption} onChange={handleGenderChange}>
                                <FormControlLabel value="V" control={<Radio color={"primary"}/>} label="Vrouw"/>
                                <FormControlLabel value="M" control={<Radio color={"primary"}/>} label="Man"/>
                                <FormControlLabel value="X" control={<Radio color={"primary"}/>} label="X"/>
                            </RadioGroup>
                        </div>
                        <br/>
                        <div>
                            <TextField
                                required
                                onBlur={handleFocusLoss}
                                value={birthDate}
                                id="date"
                                label="Geboortedatum"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleBirthDateChange}
                            />
                        </div>
                        <br/>
                        <div>
                            <TextField onBlur={handleFocusLoss} value={birthPlace} required id="birthplace" label="Geboorteplaats" onChange={handleBirthPlaceChange}/>
                        </div>
                        <br/>
                        <div>
                            <TextField onBlur={handleFocusLoss} value={birthCountry} required id="birthCountry" label="Geboorteland" onChange={handleBirthCountryChange}/>
                        </div>
                        <br/>
                        <div>
                            <TextField onBlur={handleFocusLoss} value={wkt} required id="wkt" label="WKT" onChange={handleWktChange}/>
                        </div>
                    </form>
                </Col>
                <Col md={8}>
                    <pre dangerouslySetInnerHTML={ { __html: JSON.stringify(template, null, 4) } }></pre>
                </Col>
            </Row>

        </div>

    )
}

export default BasicDataEditorComponent;
