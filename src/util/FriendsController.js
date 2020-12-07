import {deleteFile, patchFile, putFile} from "./FileUtil";
import ns from "./NameSpaces";
import {DataFactory, Writer, Quad, Variable, Parser, Store} from "n3";
import {createContractStatusPatch, quadListToTTL} from "./QueryUtil";
import notify from "./notifications";
import useContracts from "../hooks/useContracts";
import {parseURL} from "url-toolkit";
import {useState} from "react";

const wkt = require('wkt');
const { parse } = require('wkt');

const {namedNode, blankNode, literal, quad, variable} = DataFactory;


/**
 *
 * TODO: changes paramas --> @param {*} proposalContacts : [{ label: "Spouse" | "Witness", type: "spouse" | "witness", webID: string, id: number}]
 */
export async function createFriendRequest(proposalContacts, storageLocation, webId) {
    let proposalId = storageLocation.endsWith('/') ? storageLocation : storageLocation + '/'
    proposalId = proposalId + getProposalName()
    if (proposalContacts.filter(e => e.type === 'person').length <= 1) throw new Error('A friend request requires 2 persons to be specified.')

    // Create file with proposal on proposalId
    const postbody = await createFriendRequestBody(proposalContacts, webId);
    const post = await putFile(proposalId, postbody)

    // Patch profile with information on created proposal
    const patchbody = await addContractPatch(webId, proposalId);
    const patch = await patchFile(webId, patchbody)

    // Create and send notifications to all parties involved
    const sentContacts = [];
    for (let contact of proposalContacts) {
        if (sentContacts.indexOf(contact.webId) === -1) {
            sendContactInvitation(webId, contact.webId, proposalId)
            sentContacts.push(contact.webId)
        }
    }
}

export async function sendContactInvitation(webId, contactId, proposalId) {
    return notify(await createFriendRequestInvitation(webId, contactId, proposalId), [contactId])
}

export async function deleteRequest(proposalId, webId) {
    // Remove proposal and patch profile to remove reference.
    const patchbody = await deleteRequestProfilePatch(webId, proposalId)
    const result = await deleteFile(proposalId)
    const patch = await patchFile(webId, patchbody)
}

/**
 * Accept the invitation of the marriage proposal to be a spouse / witness
 * @param {string} webId - The WebId of the invitee
 * @param {string} proposalId - The URI of the proposal
 */
export async function acceptRequest(webId, proposalId, authorId) {
    const patchbody = 'INSERT {' + await quadListToTTL([quad(namedNode(webId), namedNode(ns.demo('accepted')), namedNode(proposalId))]) + ' }';
    const patch = await patchFile(webId, patchbody)
    const notification = await createAcceptanceNotification(webId, proposalId, authorId)
    notify(notification, [authorId])
}

/**
 * Refuse the invitation of the marriage proposal to be a spouse / witness
 * @param {string} webId - The WebId of the invitee
 * @param {string} proposalId - The URI of the proposal
 */
export async function refuseRequest(webId, proposalId, authorId) {
    const patchbody = 'INSERT {' + await quadListToTTL([quad(namedNode(webId), namedNode(ns.demo('refused')), namedNode(proposalId))]) + ' }';
    const patch = await patchFile(webId, patchbody)
    const notification = await createRejectionNotification(webId, proposalId, authorId)
    notify(notification, [authorId])
}

export async function officiateRequest(webId, contractId, contacts) {
    //TODO: create notification that friendship is official
    //TODO: update contract status to 'FRIENDS'
    contacts.map(async (contact, index) => {
        const notification = createFriendRequestOfficialNotification(webId, contact.id, contractId);
        await notify(notification, [contact.id]);
    })

    // Create submission notification
    //const notification = createMarriageContractSubmissionNotification(webId, contractId, officialId)
    //await notify(notification, [officialId])

    // update marriage contract proposal to submitted
    await updateFriendRequestStatus(contractId, "official")
}


/**
 * Update the status of the marriage contract proposal.
 * @param {'pending' | 'official' | 'accepted' | 'rejected'} newStatus
 */
export async function updateFriendRequestStatus(contractId, newStatus) {
    const status = ns.demo(newStatus)
    const patchbody = await createContractStatusPatch(contractId, status);
    const patch = await patchFile(contractId, patchbody)
    return patch.status
}

/**
 * Create Friend Request body (ttl)
 * TODO: change params --> @param {spouse: [], witness: []} marriageInfo required to contain a spouse field with an array of 2 webIds, and a witness field with an array of more than 1 webId
 */
async function createFriendRequestBody(proposalData, creatorId) {
    const quadList = [quad(namedNode(''), namedNode(ns.rdf('type')), namedNode(ns.demo('FriendRequest'))),
        quad(namedNode(''), namedNode(ns.dct('creator')), namedNode(creatorId)),
        quad(namedNode(''), namedNode(ns.dct('created')), literal(new Date().toISOString(), namedNode(ns.xsd('dateTime')))),
        quad(namedNode(''), namedNode(ns.demo('status')), namedNode(ns.demo('proposal')))]
    for (let person of proposalData.filter(e => e.type === 'person'))
        quadList.push(quad(namedNode(''), namedNode(ns.dbo('person')), namedNode(person.webId)))
    return await quadListToTTL(quadList);
}

export function createAcceptanceNotification(webId, proposalId, authorId) {
    return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Accept ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Invite ;
        as:actor <${authorId}> ;
        as:object <${webId}> ;
        as:target <${proposalId}> ;
      ] ;
      as:target <${proposalId}> ;
      as:summary "Accepted the offer to participate in the marriage contract" .
  `
}

export function createRejectionNotification(webId, proposalId, authorId) {
    return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Reject ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Invite ;
        as:actor <${authorId}>  ;
        as:object <${webId}> ;
        as:target <${proposalId}> ;
      ] ;
      as:target <${proposalId}> ;
      as:summary "Rejection of the offer to participate in the marriage contract" .
  `
}

export function createFriendRequestOfficialNotification(webId, contactId, friendRequestId) {
    return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Announce ;
      as:actor <${webId}> ;
      as:object <${contactId}>;
      as:target <${friendRequestId}> ;
      as:summary "Announcement that the friendship if now official" .
    `
}

export function createFriendRequestInvitation(webId, contactId, friendRequestId) {
    return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Offer ;
      as:actor <${webId}> ;
      as:object <${contactId}> ;
      as:target <${friendRequestId}> ;
      as:summary "Offer to participate in the friendship" .
  `
}

export function getFriends(contracts, webId) {
    let contacts = [];
    if (contracts && contracts.length) {
        const filteredContracts = contracts.filter(e => !e.status || e.status === ns.demo('official'));
        filteredContracts.map((contract) => {
            const person = contract.person.length === 1 ? contract.person[0] : contract.person.filter(e => e.id !== webId)[0];
            contacts.push({contractId: contract.id, person: person})
        })
    }
    return contacts;
}

export async function getFriendLocations(friends) {
    let locationObjects = [];

    const promises = friends.map( async (friend) => {
        const parsedURI = parseURL(friend.person.id);
        const snippetLocation = parsedURI.scheme + parsedURI.netLoc + '/public/person.ttl';

        const response = await fetch(snippetLocation);
        const data = await response.text();

        parseSnippetData(data).then( wktString => {
            const location = wkt.parse(wktString);
            locationObjects.push({webId: friend.person.id, location: [location.coordinates[1], location.coordinates[0]]});
        });

    });
    return Promise.all(promises).then( () => {
        return locationObjects;
    })

}

function parseSnippetData(data){
    const parser = new Parser();
    return new Promise( (resolve => {
        parser.parse(data, (err, quad, pref) => {
            if(quad && extractLocation(quad)){
                resolve(extractLocation(quad));
            }
        });
    }));
}

function extractLocation(quad) {
    return quad && quad.predicate.value === "http://www.opengis.net/ont/geosparql#asWKT" ? quad.object.value : null;
}

export async function deleteRequestProfilePatch(webId, proposalId) {
    return `DELETE { ${await quadListToTTL([quad(namedNode(webId), namedNode(ns.demo('hasContract')), namedNode(proposalId))])} } `
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Get unique proposal file name
 */
const getProposalName = () => {
    const s = "friendrequest" + new Date().toISOString()
    return encodeURIComponent(s) + '.ttl'
}

export async function addContractPatch(webId, proposalId) {
    return `INSERT { ${await quadListToTTL([quad(namedNode(webId), namedNode(ns.demo('hasContract')), namedNode(proposalId))])} } `
}

export async function patchProfileWithContract(webId, contractId) {
    const patchbody = await addContractPatch(webId, contractId)
    const patch = await patchFile(webId, patchbody)
}
