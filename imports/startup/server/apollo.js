import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from '/imports/api/apollo/schema';
import { resolvers } from '/imports/api/apollo/resolvers';
import { setup } from 'meteor/swydo:ddp-apollo';

const schema = makeExecutableSchema({ typeDefs, resolvers });

setup({
  schema,
});

createApolloServer({
  schema,
});
