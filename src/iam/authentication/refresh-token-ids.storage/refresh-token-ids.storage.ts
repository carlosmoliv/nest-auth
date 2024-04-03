import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap(): any {
    // TODO: Move this to a dedicated "RedisModule" instead of initiating the connection here
    this.redisClient = new Redis({
      // TODO: Use environment variables instead
      host: 'localhost',
      port: 6379,
    });
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    return storedId === tokenId;
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
