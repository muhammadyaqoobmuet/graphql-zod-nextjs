"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { UserProvider } from "@/context/userContext";

export const client = new ApolloClient({
  uri: "/api/graphql", // Fixed: add the correct GraphQL endpoint
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>{children}</UserProvider>
    </ApolloProvider>
  );
}
