import React, {useEffect, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {makeStyles} from "@material-ui/core/styles";
import {getFriendLocations, getFriends, getFriendSnippetData} from "../util/FriendsController";
import useContracts from "../hooks/useContracts";
import ProfileCardComponent from "./ProfileCardComponent";

const useStyle = makeStyles({
    map: {
        height: '500px'
    }
})

const MapComponent = (props) => {
    const position = [50.5010789, 4.4764595];
    const classes = useStyle();

    const userContracts = useContracts(props.webId)
    const friends = getFriends(userContracts, props.webId);

    const [locationObjects, setLocationObjects] = useState([]);


    useEffect(() => {
        let mounted = true;
        getFriendLocations(friends).then(locations => {
            if (locations.length && mounted) setLocationObjects(locations)
        });
        return () => mounted = false;
    }, [userContracts])

    return (
        <div className='container'>
            <h3 className='container'>Map overview of your friends</h3>
            <br/>
            <MapContainer className={classes.map} center={position} zoom={8} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locationObjects.length && locationObjects.map(object => {
                    return (
                        <Marker key={object.webId} position={object.location}>
                            <Popup>
                                <a target='_blank' href={object.webId}>{object.webId}</a>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>

    )
}

export default MapComponent;
