import { Mongo } from 'meteor/mongo';

const TradeOperations = new Mongo.Collection('operations');

export default TradeOperations;
