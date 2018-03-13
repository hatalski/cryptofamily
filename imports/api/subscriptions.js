import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const pubsubRedis = new RedisPubSub({
  connection: {
    host: '192.168.1.46',
    port: 32768,
    retry_strategy: options =>
    // reconnect after
      Math.max(options.attempt * 100, 3000)
    ,
  },
});

export const pubsub = new PubSub();
