import { ulid } from 'ulid';
import { Entity, EntityItem } from 'electrodb';
import { Dynamo } from "./dynamo";

export * as User from './user';

export const UserEntity = new Entity({
    model: {
        version: "1",
        entity: "User",
        service: "lms"
    },
    attributes: {
        userID: {
            type: "string",
            required: true,
            readOnly: true,
        },
        name: {
            type: "string",
            required: true,
        },
        email: {
            type: "string",
            required: true,
        }
    },
    indexes: {
        primary: {
            pk: {
                field: 'pk',
                composite: ['userID']
            },
            sk: {
                field: 'sk',
                composite: ['userID']
            }
        }
    },
},
    Dynamo.Configuration
)

export type UserEntityType = EntityItem<typeof UserEntity>;


export async function create({ name, email }: {
    name: string;
    email: string;
}) {
    const createUserResponse = await UserEntity.create({
        userID: ulid(),
        name,
        email
    }).go();

    return createUserResponse.data;
}

export async function rename({ name, userID }: {
    userID: string;
    name: string;
}) {
    const updateUserResponse = await UserEntity.update({ userID }).set({ name }).go();
    return updateUserResponse.data;
}


export async function get({ userID }: {
    userID: string;
}) {
    const userResponse = await UserEntity.get({ userID }).go();
    return userResponse.data
}

export async function organisationUsers({ organisationID }: { organisationID: string }) {

    const orgUserListResponse = await UserEntity.query.primary({ organisationID }).go();

    return orgUserListResponse.data;
}
