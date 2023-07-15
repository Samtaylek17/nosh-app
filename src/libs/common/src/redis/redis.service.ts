import { Redis, ChainableCommander } from 'ioredis';

import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  /**
   * The function returns a ChainableCommander object for executing multiple Redis commands.
   * @returns The method `multi()` is returning a `ChainableCommander` object.
   */
  public multi(): ChainableCommander {
    return this.redisClient.multi();
  }

  /**
   * The function executes a command on a Redis client, either using a provided multi command object or
   * the default Redis client.
   * @param {ChainableCommander} multi - The `multi` parameter is an optional parameter of type
   * `ChainableCommander`. It is used to specify a multi command object that allows multiple commands
   * to be executed atomically. If `multi` is provided, the `exec` method will execute the commands in
   * the multi command object. Otherwise,
   */
  public async exec(multi: ChainableCommander): Promise<void> {
    const client = multi || this.redisClient;
    await client.exec();
  }

  /**
   * The function `sAdd` adds a value to a set in Redis.
   * @param {string} hash - The `hash` parameter is a string that represents the name of the set in
   * Redis where the value will be added.
   * @param {string} value - The `value` parameter is a string representing the value that you want to
   * add to the set identified by the `hash` parameter.
   * @param {ChainableCommander} [multi] - The "multi" parameter is an optional parameter of type
   * "ChainableCommander". It is used to specify a multi command object that allows multiple Redis
   * commands to be executed atomically. If the "multi" parameter is provided, the "sadd" command will
   * be added to the multi command object
   * @returns either a `ChainableCommander` object or a `Promise<number>`.
   */
  public sAdd(
    hash: string,
    value: string,
    multi?: ChainableCommander,
  ): ChainableCommander | Promise<number> {
    const client = multi || this.redisClient;
    return client.sadd(hash, value);
  }

  /**
   * The function `sRem` removes a member from a set in Redis.
   * @param {string} hash - The `hash` parameter is a string that represents the key of the set in
   * Redis. It is used to identify the set to which the `setMember` belongs.
   * @param {string} setMember - The `setMember` parameter is a string that represents the member to be
   * removed from the set identified by the `hash` parameter.
   * @param {ChainableCommander} [multi] - The `multi` parameter is an optional parameter of type
   * `ChainableCommander`. It represents a Redis multi command object that allows you to execute
   * multiple Redis commands as a single atomic operation. If the `multi` parameter is provided, the
   * `srem` command will be executed within the context of
   * @returns either a `ChainableCommander` object or a `Promise<number>`.
   */
  public sRem(
    hash: string,
    setMember: string,
    multi?: ChainableCommander,
  ): ChainableCommander | Promise<number> {
    const client = multi || this.redisClient;
    return client.srem(hash, setMember);
  }

  /**
   * The function `sMembers` returns a promise that resolves to an array of strings, representing the
   * members of a Redis set identified by the given hash.
   * @param {string} hash - The parameter "hash" is a string that represents the key of a Redis set.
   * @returns a Promise that resolves to an array of strings.
   */
  public sMembers(hash: string): Promise<string[]> {
    return this.redisClient.smembers(hash);
  }

  /**
   * The `expire` function sets an expiration time for a key in Redis.
   * @param {string} key - The key is a string that represents the name of the key in the Redis
   * database that you want to set an expiration time for.
   * @param {number} time - The "time" parameter represents the duration in seconds for which the key
   * should be set to expire. After the specified time has elapsed, the key will be automatically
   * deleted from the Redis database.
   * @param {ChainableCommander} [multi] - The `multi` parameter is an optional parameter of type
   * `ChainableCommander`. It represents a Redis multi command object that allows you to execute
   * multiple Redis commands as a single atomic operation. If the `multi` parameter is provided, the
   * `expire` command will be executed on the `multi`
   * @returns either a ChainableCommander object or a Promise<number>.
   */
  public expire(
    key: string,
    time: number,
    multi?: ChainableCommander,
  ): ChainableCommander | Promise<number> {
    const client = multi || this.redisClient;
    return client.expire(key, time);
  }
}
