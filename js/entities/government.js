// @flow

const {
  oneOf, randomIn, normalIn,
  weightedOneOf,
} = require('../utils/stochastic');
const {
  makePerson, isFilthyRich, isRich, isMiddleClass,
} = require('../entities/person');
const {
  randomFaction,
} = require('../utils/factions');
const {
  makeValue,
} = require('../utils/simulatedValues');
const {config, prototype} = require('../config');

import type {
  FactionName, Person, Faction, Dollar,
  Title, Outcome, Skill, Petition, State,
} from 'types';

const makeRandomGovernment = () => {
  const faction = randomFaction();
  const leader = makePerson(faction, config.leadershipTitles[faction]);

  const factions = {
    Army: makeFaction('Army', faction),
    ["Secret Police"]: makeFaction('Secret Police', faction),
    Business: makeFaction('Business', faction),
    Clergy: makeFaction('Clergy', faction),
    Parliament: makeFaction('Parliament', faction),
    Workers: makeFaction('Workers', faction),
  };

  const gov = {
    leader,
    type: config.governmentTitles[faction],
    factions,
    population: [
      ...factions["Army"].people,
      ...factions["Workers"].people,
      ...factions["Secret Police"].people,
      ...factions["Clergy"].people,
      ...factions["Business"].people,
      ...factions["Parliament"].people,
    ],

    petitionQueue: [],
    turn: 0,

    coercion: makeValue(0),
    money: makeValue(isFilthyRich()),
    production: makeValue(0),
    legitimacy: makeValue(0),
    land: makeValue(100, 'Total National Land'),
  };
  gov.land.factors.push({
    name: 'Army Bases',
    value: -1 * factions["Army"].land.value,
  });
  gov.land.factors.push({
    name: 'Worker\'s Homes',
    value: -1 * factions["Workers"].land.value,
  });
  gov.land.factors.push({
    name: 'Police Headquarters',
    value: -1 * factions["Secret Police"].land.value,
  });
  gov.land.factors.push({
    name: 'Church Grounds',
    value: -1 * factions["Clergy"].land.value,
  });
  gov.land.factors.push({
    name: 'Factories',
    value: -1 * factions["Business"].land.value,
  });
  gov.land.factors.push({
    name: 'Parliament Building',
    value: -1 * factions["Parliament"].land.value,
  });
  gov.coercion.isNonCumulative = true;

  return gov;
};

const makeFaction = (name: FactionName, governmentFaction: FactionName): Faction => {
  const isGovernmentFaction = name == governmentFaction;

  const faction = {
    name,
    people: [],
    land: 0,
  };
  const titles = config.factionTitles[name];

  // set faction resources

  // set faction finances

  // set faction people
  const leader = makePerson(name, titles[0]);
  leader.isLeader = true;
  leader.income *= 2;
  faction.people.push(leader);

  for (let i = 0; i < prototype[faction].numPeople - 1; i++) {
    faction.people.push(makePerson(name, titles[1]));
  }

  // set faction information


  // turn everything into values
  for (const resource of config.factionResources) {
    if (faction[resource] == null) continue;
    faction[resource] = makeValue(faction[resource]);
  }
  return faction;
};

module.exports = {
  makeRandomGovernment,
};
