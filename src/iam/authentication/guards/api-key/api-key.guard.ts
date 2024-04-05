import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ApiKey } from '../../../../user/api-keys/entities/api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKeysService } from '../../api-keys.service';
import { REQUEST_USER_KEY } from '../../../iam.constants';
import { ActiveUserData } from '../../../interfaces/active-user-data.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractKeyFromHeader(request);
    if (!apiKey) throw new UnauthorizedException();
    const apiKeyEntityId = this.apiKeysService.extractIdFromApiKey(apiKey);
    try {
      const apiKeyEntity = await this.apiKeysRepository.findOne({
        where: { uuid: apiKeyEntityId },
        relations: { user: true },
      });
      await this.apiKeysService.validate(apiKey, apiKeyEntity.key);
      request[REQUEST_USER_KEY] = {
        substring: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
        permissions: apiKeyEntity.user.permissions,
      } as ActiveUserData;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }
}
