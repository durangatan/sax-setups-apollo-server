import * as admin from 'firebase-admin';
import { ApolloServer, gql } from 'apollo-server';
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const typeDefs = gql`
  # A Sax Player
  type Player {
    id: ID!
    firstName: String!
    lastName: String!
    setups: [Setup]
    images: [Image]
    tweetCount: Int
  }

  # A Saxo's Setup
  type Setup {
    id: ID!
    mouthpieces: [Mouthpiece]
    reeds: [Reed]
    saxophones: [Saxophone]
    voice: String
    player: Player!
    playerId: String!
  }

  # A Mouthpiece
  type Mouthpiece {
    id: ID!
    setup: Setup!
    setupId: String!
    make: String
    model: String
    material: String
    tipOpening: String
    other: String
    year: String
  }

  # A Saxophone
  type Saxophone {
    id: ID!
    setup: Setup!
    setupId: String!
    make: String
    model: String
    material: String
    finish: String
    year: String
    serial: String
    other: String
  }

  # A Reed
  type Reed {
    id: ID!
    setup: Setup!
    setupId: String!
    make: String
    model: String
    material: String
    other: String
  }

  # A Ligature
  type Ligature {
    id: ID!
    setupId: String!
    setup: Setup!
    make: String
    other: String
  }

  type ImageTransform {
    source: String!
    width: Int
    height: Int
  }
  type Image {
    full: ImageTransform
    thumb: ImageTransform
  }

  type Query {
    players: [Player!]!
  }
`;

const resolvers = {
  Query: {
    async players() {
      const playersSnap = await admin
        .firestore()
        .collection('players')
        .get();

      return playersSnap.docs.map(doc => doc.data());
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  },
  introspection: true
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
