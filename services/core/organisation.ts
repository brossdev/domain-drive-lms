import { ulid } from 'ulid';
import { Entity, EntityItem } from 'electrodb';
import { Dynamo } from "./dynamo";

export * as Organisation from './organisation';


export const OrganisationEntity = new Entity({
    model: {
        version: "1",
        entity: "Organisation",
        service: "lms"
    },
    attributes: {
        organisationID: {
            type: "string",
            required: true,
            readOnly: true,
        },
        name: {
            type: "string",
            required: true,
        }
    },
    indexes: {
        organisations: {
            pk: {
                field: 'pk',
                composite: []
            },
            sk: {
                field: 'sk',
                composite: ['organisationID']
            }
        },
    },
},
    Dynamo.Configuration
)

export type OrganisationEntityType = EntityItem<typeof OrganisationEntity>;

export async function create({ name }: {
    name: string;
}) {

    const newOrganisationResponse = await OrganisationEntity.create({
        organisationID: ulid(),
        name,
    }).go()

    return newOrganisationResponse.data

}

export async function rename({ name, organisationID }: {
    organisationID: string;
    name: string;
}) {

    const updateOrgResponse = await OrganisationEntity.update({ organisationID }).set({ name }).go();
    return updateOrgResponse.data;
}

export async function get({ organisationID }: {
    organisationID: string;
}) {
    const organisationResponse = await OrganisationEntity.query.organisations({ organisationID }).go();
    return organisationResponse.data
}

export async function list() {

    const orgListResponse = await OrganisationEntity.query.organisations({}).go();

    return orgListResponse.data;
}

export async function organisationUsers({ organisationID }: { organisationID: string }) {

    const orgUserListResponse = await OrganisationEntity.query.organisations({ organisationID }).go();

    return orgUserListResponse.data;
}
