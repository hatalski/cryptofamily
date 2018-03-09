import { Mongo } from 'meteor/mongo';

export const Accounts = new Mongo.Collection('accounts');

export const Transactions = new Mongo.Collection('transactions');

export const TradeOperations = new Mongo.Collection('operations');