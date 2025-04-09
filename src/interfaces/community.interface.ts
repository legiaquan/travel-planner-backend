import { Document } from 'mongoose';

import { ICommunity } from '@/types/community.type';

export interface ICommunityDocument extends Omit<ICommunity, '_id'>, Document {
  // Add any community-specific methods here
  addMember(userId: string, role: string): Promise<void>;
  removeMember(userId: string): Promise<void>;
  changeMemberRole(userId: string, role: string): Promise<void>;
  isMember(userId: string): boolean;
  getMemberRole(userId: string): string | null;
}
