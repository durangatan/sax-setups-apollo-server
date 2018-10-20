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
