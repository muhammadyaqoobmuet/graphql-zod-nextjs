import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { resolver } from "./resolvers";
import schema from "./schema";

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    return { name: "auth" };
  },
});

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
