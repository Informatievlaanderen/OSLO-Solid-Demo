import React from 'react'
import * as N3 from 'n3'
import NotificationsViewerComponent from '../Components/NotificationsViewerComponent'
import InProgressViewerComponent from '../Components/InProgressViewerComponent'
import ProfileViewerComponent from '../Components/ProfileViewerComponent'
import ProfileEditorComponent from '../Components/ProfileEditorComponent'
import HelpComponent from '../Components/HelpComponent'
import LoginComponent from '../Components/LoginComponent'
import PlaygroundComponent from "../Components/PlaygroundComponent";
import {getFile} from './FileUtil'

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HelpIcon from '@material-ui/icons/Help';
import ListIcon from '@material-ui/icons/List';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import PublishIcon from '@material-ui/icons/Publish';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MapIcon from '@material-ui/icons/Map';
import GroupIcon from '@material-ui/icons/Group';
import CopyrightIcon from '@material-ui/icons/Copyright';

import ns from "../util/NameSpaces"
import {checkCache, setCache} from './Cache'
import DataUploadComponent from "../Components/DataUploadComponent";
import FriendRequestComponent from "../Components/FriendRequestComponent";
import FriendshipViewComponent from "../Components/FriendshipViewComponent";
import MapComponent from "../Components/MapComponent";
import FriendsOverviewComponent from "../Components/FriendsOverviewComponent";
import CreditsComponent from "../Components/CreditsComponent";

const {default: data} = require('@solid/query-ldflex');
export const validStatusCodes = [200, 201, 202]

export async function getPromiseValueOrUndefined(promise) {
    try {
        return await promise.value
    } catch {
        return undefined
    }
}

export const availableViews = {
    login: {
        id: "login",
        label: 'Solid',
        generation: (props) => <LoginComponent {...props} ></LoginComponent>,
        icon: <ExitToAppIcon/>
    },
    playground: {
        id: "playground",
        label: 'Playground',
        generation: (props) => <PlaygroundComponent {...props} ></PlaygroundComponent>,
        icon: <SportsEsportsIcon/>
    },
    upload: {
        id: "upload",
        label: 'Upload',
        generation: (props) => <DataUploadComponent {...props}></DataUploadComponent>,
        icon: <PublishIcon/>
    },
    friendrequest: {
        id: "friendrequest",
        label: 'Friend request',
        generation: (props) => <FriendRequestComponent {...props}></FriendRequestComponent>,
        icon: <GroupAddIcon/>
    },
    friendshipview:  {
        id: "friendshipview",
        label: 'Friendship details',
        generation: (props) => <FriendshipViewComponent {...props}></FriendshipViewComponent>,
        icon: <HelpIcon/>
    },
    friendoverview: {
        id: "friendoverview",
        label: "Friends overview",
        generation: (props) => <FriendsOverviewComponent {...props}></FriendsOverviewComponent>,
        icon: <GroupIcon/>
    },
    profile: {
        id: "profile",
        label: 'Profile',
        generation: (props) => <ProfileViewerComponent {...props} ></ProfileViewerComponent>,
        icon: <PersonIcon/>
    },
    profileeditor: {
        id: "profileedit",
        label: 'Profile Editor',
        generation: (props) => <ProfileEditorComponent {...props} ></ProfileEditorComponent>,
        icon: <HelpIcon/>
    },
    map: {
        id: "map",
        label: 'Map',
        generation: (props) => <MapComponent {...props}></MapComponent>,
        icon: <MapIcon/>
    },
    running: {
        id: "running",
        label: 'Running requests',
        generation: (props) => <InProgressViewerComponent {...props}></InProgressViewerComponent>,
        icon: <ListIcon/>
    },
    notifications: {
        id: "notifications",
        label: 'Notifications',
        generation: (props) => <NotificationsViewerComponent {...props}></NotificationsViewerComponent>,
        icon: <NotificationsIcon/>
    },
    help: {
        id: "help",
        label: 'Help',
        generation: (props) => <HelpComponent {...props}></HelpComponent>,
        icon: <HelpIcon/>
    },
    credits: {
        id: "credits",
        label: 'Credits',
        generation: (props) => <CreditsComponent {...props}></CreditsComponent>,
        icon: <CopyrightIcon/>
    }
}

export const activeDrawerItemMapping = {
    profile: "profile",
    playground: "playground",
    upload: "upload",
    profileeditor: "profile",
    friendrequest: "requests",
    friendshipview: "running",
    running: "running",
    notifications: "notifications",
    help: "help",
    credits: "credits"
}

export async function getStore(URI, useCache = true, ttl = null) {
    let cached = null
    if (useCache) cached = checkCache(URI)
    if (cached) return cached;
    try {
        const response = await getFile(URI)
        const code = (await response).status
        if (validStatusCodes.indexOf(code) === -1) {
            return null;
        }
        const responseData = await response.text()

        // If concurrent requests already filled cache
        if (useCache) cached = checkCache(URI)
        if (cached) return cached;

        const store = new N3.Store()
        store.addQuads(await new N3.Parser({baseIRI: URI}).parse(responseData))
        if (store) {
            if (!checkCache(URI)) setCache(URI, store, ttl);
        }
        return store
    } catch (e) {
        console.error(e)
        return null
    }

}

const getQuadObjVal = quads => quads[0] && (quads[0].object.value || quads[0].object.id)

const getQuadObjList = quads => quads && quads.map(quad => quad.object.value || quad.object.id)

export async function uploadDataSnippet(location, data) {
    const response = await fetch(location, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/ld+json'
        },
        body: data
    });
    return response;
}

export async function getContractData(id) {
    id = await id;
    if (!id) return null
    const datastore = await getStore(id);
    return datastore && {
        id: id,
        type: getQuadObjVal(await datastore.getQuads(id, ns.rdf('type'))),
        creator: getQuadObjVal(await datastore.getQuads(id, ns.dct('creator'))),
        created: getQuadObjVal(await datastore.getQuads(id, ns.dct('created'))),
        status: getQuadObjVal(await datastore.getQuads(id, ns.demo('status'))),
        person: getQuadObjList(await datastore.getQuads(id, ns.dbo('person'))).map(e => {
            return({id: e})
        })
    }
}

export async function getProfileData(id, cached = true) {
    id = await id;
    if (!id) return null
    const datastore = await getStore(id, cached);
    return datastore && {
        id: id,
        name: getQuadObjVal(await datastore.getQuads(id, ns.foaf('name'))),
        bdate: getQuadObjVal(await datastore.getQuads(id, ns.dbo('birthDate'))),
        location: getQuadObjVal(await datastore.getQuads(id, ns.dbo('location'))),
        // cstatus: getQuadObjVal(await datastore.getQuads(id, ns.demo('civilstatus'))),
    }
}

export async function getProfileContracts(id) {
    id = await id;
    if (!id) return null
    const datastore = await getStore(id);
    return datastore && getQuadObjList(await datastore.getQuads(id, ns.demo('hasContract')))
}

export async function getNotificationTypes(activity) {
    const types = {}
    let count = 0
    for (const property of ['actor', 'object', 'target']) {
        if (activity[property]) {
            if (typeof (activity[property]) === 'string') {
                try {
                    types[property] = await getItemType(activity[property])
                } // `${await data[activity[property]].type}`}
                catch {
                    types[property] = null
                }
            } else if (typeof (activity[property]) === 'object') {
                types[property] = await getNotificationTypes(activity[property])
            }
        }
    }
    return types
}

export async function getItemType(itemId) {
    if (!itemId) return false;
    const store = await getStore(itemId)
    if (!store) throw new Error('Could not retrieve notification type for ' + itemId)
    return store && getQuadObjVal(await store.getQuads(itemId, ns.rdf('type')))

}

export function formatDate(date) {
    date = new Date(date)
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return (mm + '/' + dd + '/' + yyyy)
}
