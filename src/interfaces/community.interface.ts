import { Document } from 'mongoose';
import { ICommunity } from '../types/community.type';

export interface ICommunityDocument extends ICommunity, Document {
  // Add any community-specific methods here
  addMember(userId: string, role: string): Promise<void>;
  removeMember(userId: string): Promise<void>;
  changeMemberRole(userId: string, newRole: string): Promise<void>;
  isMember(userId: string): boolean;
  getMemberRole(userId: string): string | null;
} 