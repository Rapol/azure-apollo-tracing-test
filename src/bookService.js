const { ApolloServer, gql } = require('apollo-server-azure-functions');
const { buildFederatedSchema } = require('@apollo/federation');

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// The GraphQL schema in string form
const typeDefs = gql`
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books },
};

// Put together a schema
const schema = buildFederatedSchema([{
  typeDefs,
  resolvers,
}]);


const server = new ApolloServer({
    schema,
    tracing: true,
    // debug: true,
    introspection: true,
    playground: true,
});

module.exports = server.createHandler();
