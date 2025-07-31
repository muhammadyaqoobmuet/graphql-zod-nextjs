export const schema = `#graphql

    type User {
      id: ID!
      email: String!
      createdAt: String!
      token: String
      issues: [Issue]!
    }

enum IssueStatus {
  BACKLOG
  TODO
  INPROGRESS
  DONE
}

type Issue {
  id: ID!
  createdAt: String!
  userId: String!
  user: User!
  status: IssueStatus
  content: String!
  name: String!
}

input AuthInput {
  email: String!
  password: String!
}


input CreateIssueInput {
  name: String!
  content: String!
  status: IssueStatus
}

input EditIssueInput {
  name: String
  content: String
  status: IssueStatus
  id: ID!
}

input IssuesFilterInput {
  statuses: [IssueStatus]
}

type Query {
  hello: String
  me: User 
  loginUser(input:AuthInput!):User
  Issues:Issue!
}

type Mutation {
  createUser(input: AuthInput!): User
  createIssue(input:CreateIssueInput!):Issue
}
`;

export default schema;
