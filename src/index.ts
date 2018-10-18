import * as admin from 'firebase-admin';

const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

import { ApolloServer, gql } from 'apollo-server';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
}

enum Voice {
  Soprano,
  Alto,
  Tenor,
  Baritone,
  Unknown
}

interface Setup {
  id: string;
  playerId: string;
  voice: Voice;
}

interface Mouthpiece {
  id: string;
  setupId: string;
  make?: string;
  model?: string;
  material?: string;
  tipOpening?: string;
  other?: string;
  year?: string;
}

interface Saxophone {
  id: string;
  setupId: string;
  make?: string;
  model?: string;
  material?: string;
  finish?: string;
  year?: string;
  serial?: string;
  other?: string;
}

interface Reed {
  id: string;
  setupId: string;
  make?: string;
  model?: string;
  material?: string;
  other?: string;
}

interface Ligature {
  id: string;
  setupId: string;
  make?: string;
  other?: string;
}

const typeDefs = gql`
  # A Sax Player
  type Player {
    id: ID!
    firstName: String!
    lastName: String!
    setups: [Setup]
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

  type Query {
    players: [Player]
  }
`;

const resolvers = {
  Query: {
    async players() {
      const players = await admin
        .firestore()
        .collection('players')
        .get();
      const setups = await admin
        .firestore()
        .collection('setup')
        .get();
      const mouthpieces = await admin
        .firestore()
        .collection('mouthpieces')
        .get();
      const reeds = await admin
        .firestore()
        .collection('reeds')
        .get();
      const saxophones = await admin
        .firestore()
        .collection('saxophones')
        .get();
      return players.docs.map(player => {
        const playerData = player.data();
        return Object.assign(
          playerData,
          {
            setups: setups.docs.filter(setup => setup.data().playerId === player.id).map(setup => {
              return Object.assign(setup.data(), {
                mouthpieces: mouthpieces.docs
                  .map(mouthpiece => mouthpiece.data())
                  .filter(mouthpiece => mouthpiece.setupId === setup.id),
                reeds: reeds.docs.map(reed => reed.data()).filter(reed => reed.setupId === setup.id),
                saxophones: saxophones.docs
                  .map(saxophone => saxophone.data())
                  .filter(saxophone => saxophone.setupId === setup.id)
              });
            })
          },
          { id: player }
        );
      });
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
