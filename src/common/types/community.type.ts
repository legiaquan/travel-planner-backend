export enum CommunityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  RESTRICTED = 'RESTRICTED',
}

export enum CommunityRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface ICommunity {
  _id: string;
  name: string;
  description: string;
  type: CommunityType;
  ownerId: string;
  members: Array<{
    userId: string;
    role: CommunityRole;
    joinedAt: Date;
  }>;
  coverImage?: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCommunity {
  name: string;
  description: string;
  type: CommunityType;
  coverImage?: string;
  tags?: string[];
}

export interface IUpdateCommunity {
  name?: string;
  description?: string;
  type?: CommunityType;
  coverImage?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface IAddMember {
  userId: string;
  role: CommunityRole;
}
