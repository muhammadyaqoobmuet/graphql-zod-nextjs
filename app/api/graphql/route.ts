import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { resolver } from "./resolvers";
import schema from "./schema";
import { verifyTokenAndDecodeIt } from "./lib/userAtuhentications";
import { NextRequest } from "next/server";


const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (
    req: NextRequest
  ): Promise<{ req: NextRequest; user: any  }> => {
    const authHeader = req.headers.get("authorization") || "";
    console.log("Authorization header:", authHeader);

    const user = verifyTokenAndDecodeIt(authHeader);
    console.log("Decoded user:", user);

    return {
      req,
      user,
    };
  },
});

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
