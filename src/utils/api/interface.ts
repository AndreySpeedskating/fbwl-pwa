export interface IInitialPublicKey {
  approvalInfo: {
    principalId: string;
    rpId: string;
    serverNonce: string;
  };
  continuationKey: string;
  status: string;
}

export interface IBiometryPost {
  attestation: string;
  clientData: string;
  continuationKey: string;
  JWT: string;
}

export interface IGetTokenResponse {
  execution: string;
  step: string;
  view: {
    rpId: string;
    serverNonce: string;
  };
}

export interface IUserInfo {
  displayName: string;
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  profilePicture: string;
  refreshToken: string;
  registered: boolean;
}

export interface IError {
  code: string;
  message: string;
  name: string;
}

export interface IPost {
  level: string;
  status: 'draft' | 'published';
  menuItem?: string;
  postMedia?: {
    mime: string;
    url: string;
    videoThumbnail?: string | null;
  }[];
  postText?: string;
  postTextEn?: string;
  publishedAt?: string;
  pushData?: {
    text: string;
    title: string;
  };
  title?: string;
  titleEn?: string;
}

export interface IFeedMedia {
  mime: string;
  thumbnail: string;
  url: string;
  image?: boolean;
  videoThumbnail?: string | null;
}

export type menuItem = 'backstage' | 'heroes' | 'serial' | 'video';
export interface IFeed {
  authorID: string;
  createdAt: string;
  deleted: boolean;
  id: string;
  indexInSection: number;
  level: string;
  menuItem: menuItem;
  postMedia: IFeedMedia[];
  commentCount?: number;
  hashtags?: string[];
  lastPageElement?: number;
  myReaction?: boolean;
  postText?: string;
  postTextEn?: string;
  publishAt?: string;
  publishedAt?: string;
  reactions?: {
    angry: number;
    cry: number;
    laugh: number;
    like: number;
    love: number;
    sad: number;
    surprised: number;
  };
  reactionsCount?: number;
  sectionId?: string;
  status?: 'draft' | 'published';
  title?: string;
  titleEn?: string;
}

export interface IFeedComment {
  authorID: string;
  authorUsername: string;
  comments: [
    {
      authorID: string;
      authorUsername: string;
      comments: IFeedComment[];
      commentText: string;
      createdAt: string;
      id: string;
      reactions: {
        angry: number;
        cry: number;
        laugh: number;
        like: number;
        love: number;
        sad: number;
        surprised: number;
      };
      authorProfilePictureURL?: string;
      myReaction?: boolean;
    }
  ];
  commentText: string;
  createdAt: string;
  id: string;
  reactions: {
    angry: number;
    cry: number;
    laugh: number;
    like: number;
    love: number;
    sad: number;
    surprised: number;
  };
  authorProfilePictureURL?: string;
  myReaction?: boolean;
}
export interface IWritePostMessage {
  text: string;
  parentCommentId?: string;
}

export interface ISections {
  deleted: boolean;
  id: string;
  name: string;
  nameEn: string;
  order: number;
  type: string;
}

export interface IUserSettings {
  push: boolean;
  pushCommentReplies: boolean;
  pushNewMessages: boolean;
}

export interface IPublicUserInfo {
  about: string;
  instagramProfile: string;
  publicFirstName: string;
  publicLastName: string;
  publicUsername: string;
  vkProfile: string;
}

export interface IMyInfo {
  about: string;
  active: boolean;
  appIdentifier: string | null;
  createdAt: string;
  email: string;
  fcmToken: string | null;
  firebaseId: string;
  id: string;
  instagramProfile: string;
  lastOnlineTimestamp: string | null;
  level: string;
  phoneNumber: string | null;
  profilePictureURL: string;
  publicFirstName: string;
  publicLastName: string;
  publicUsername: string;
  role: string;
  settings: {
    push: boolean;
    pushCommentReplies: boolean;
    pushNewMessages: boolean;
  };
  vkProfile: string;
}
export interface IInitSubscribe {
  confirmation_token: string;
  confirmation_url: string;
  return_url: string;
  type: string;
}

export interface ISubscribeStatus {
  accountId: string;
  autoProlong: boolean;
  autoProlongationAllowed: boolean;
  autoProlongationId: string;
  createdTs: string;
  end: boolean;
  from: string;
  id: string;
  price: number;
  prolongTs: string;
  to: string;
}

export interface IHero {
  about: string;
  createdAt: string;
  id: string;
  nickname: string;
  profilePictureURL: string | null;
}

export interface ISection {
  deleted: true;
  endPostNumber: number;
  id: string;
  name: string;
  nameEn: string;
  order: 0;
  startPostNumber: number;
}

export interface IFSToken {
  execution: string;
  form: {
    errors?: {
      field: string;
      message: string;
    }[];
  };
  id_token: string;
  view?: {
    blockedFor?: number;
    isBlocked?: boolean;
    otpCodeAvailableAttempts?: number;
    otpCodeNumber?: number;
  };
}
