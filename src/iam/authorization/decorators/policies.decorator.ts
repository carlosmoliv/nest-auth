import { SetMetadata } from '@nestjs/common';
import { Policy } from '../policies/interfaces/policy';

export const POLICIES_KEY = 'permissions';
export const Policies = (...policies: Policy[]) =>
  SetMetadata(POLICIES_KEY, policies);
