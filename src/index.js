const { GraphQLServer } = require("graphql-yoga");

// Resolver data for Feed
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  },
  {
    id: "link-1",
    url: "www.google.com",
    description: "Search engine site"
  }
];

/* How GraphQL resolver. If the resolver returns null for any mandatory fields, it will
throw error */
let idCount = links.length;

// We have resolvers for all Query and Mutations in Schema
const resolvers = {
  Query: {
    info: () => `This is API of Hackernews clone`,
    feed: () => links,
    link: (parent, args) => links[args.id]
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
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
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
