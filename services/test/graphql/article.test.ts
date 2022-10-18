import { Config } from "@serverless-stack/node/config";
import { expect, it } from "vitest";
import { createClient } from "@domain-driven-lms/graphql/genql";
import { Article } from "@domain-driven-lms/core/article";

it("create an article", async () => {
  const client = createClient({
    url: Config.API_URL + "/graphql",
  });

  const article = await client.mutation({
    createArticle: [
      { title: "Hello world", url: "https://example.com" },
      {
        id: true,
      },
    ],
  });
  const list = await Article.list();
  expect(
    list.find((a) => a.articleID === article.createArticle.id)
  ).not.toBeNull();
});
