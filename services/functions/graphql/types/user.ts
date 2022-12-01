import { User } from '@domain-driven-lms/core/user';
import { builder } from '../builder';


const UserType = builder.objectRef<User.UserEntityType>("User").implement({
    fields: (t) => ({
        id: t.exposeID("userID"),
        name: t.exposeString("name"),
        email: t.exposeString("email"),
    })
})

builder.queryFields((t) => ({
    user: t.field({
        type: UserType,
        args: {
            userID: t.arg.string({ required: true })
        },
        resolve: async (_, args) => {
            const user = await User.get({
                userID: args.userID
            })

            if (!user) {
                throw new Error("User not found");
            }

            return user;
        }
    })
}))
