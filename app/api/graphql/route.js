import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { generateSignedUrl } from '../../../lib/aws-s3';

const typeDefs = gql`
  type User {
    id: String!
    name: String!
  }

  type UploadResult {
    signedUrl: String!
    fileUrl: String!
  }

  type Query {
    getUser(id: String!): User
  }
  type Mutation {
    signFileUpload(fileKey: String!, fileType: String!): UploadResult
  }
`;

const resolvers = {
  Query: {
    // test graphql query
    getUser: async () =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ id: '1', name: 'John' }), 1000);
      }),
  },

  Mutation: {
    signFileUpload: async (parent, args) =>
      generateSignedUrl({
        fileKey: args.fileKey,
        fileType: args.fileType,
      }),
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export async function GET(request) {
  return handler(request);
}

export async function POST(request) {
  return handler(request);
}

// mutation($fileKey: String!, $fileType: String!){
//   signFileUpload(fileKey: $fileKey, fileType: $fileType) {
//     fileUrl
//     signedUrl
//   }
// }

// variables
// {
//   "fileKey": "",
//   "fileType": ""
// }
