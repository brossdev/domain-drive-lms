import { Organisation } from "@domain-driven-lms/core/organisation";
import { builder } from "../builder";

const OrganisationType = builder
  .objectRef<Organisation.OrganisationEntityType>("Organisation")
  .implement({
    fields: (t) => ({
      id: t.exposeID("organisationID"),
      name: t.exposeString("name"),
    }),
  });

builder.queryFields((t) => ({
  organisation: t.field({
    type: OrganisationType,
    args: {
      organisationID: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const organisation = await Organisation.get({
        organisationID: args.organisationID,
      });

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      return organisation;
    },
  }),
  organisations: t.field({
    type: [OrganisationType],
    resolve: async () => await Organisation.list(),
  }),
}));

builder.mutationFields((t) => ({
  createOrganisation: t.field({
    type: OrganisationType,
    args: {
      name: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args) => await Organisation.create({ name: args.name }),
  }),
}));
