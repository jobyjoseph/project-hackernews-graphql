const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

// We have resolvers for all Query and Mutations in Schema
const resolvers = {
  Query: {
    info: () => `This is API of Hackernews clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links();
    },
    link: (parent, args) => links[args.id]
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      });
    },
    updateLink: (parent, args) => {
      const link = links[args.id];
      link.description = args.description;
      link.url = args.url;
      return link;
    },
    deleteLink: (parent, args) => {
      const link = links.splice(args.id, 1);
      return link[0];
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
