export const MENU_ITEM_LIST = [
  {
    value: 'serial',
    label: 'Сериал',
  },
  {
    value: 'backstage',
    label: 'backstage',
  },
  {
    value: 'video',
    label: 'Видео',
  },
  {
    value: 'heroes',
    label: 'Герои',
  },
];

export interface IMedia {
  url: string;
  image?: true;
  mime?: string;
  thumbnail? : string;
}

export interface ICPost {
  level: string;
  postMedia: IMedia[];
  postText: string;
  title: string;
  id?: string;
  menuItem?: string;
  postTextEn?: string;
  publish?: boolean;
  publishAt?: string;
  pushData?: {
    body?: string;
    image?: string;
    title?: string;
  };
  status?: 'draft' | 'published';
  titleEn?: string;
}

export const EStatus = {
  published: 'Да',
  draft: 'Нет',
};

export const INITIAL_POST_DATA: ICPost = {
  postText: '',
  postTextEn: '',
  titleEn: '',
  menuItem: 'serial',
  title: '',
  level: 'free',
  publishAt: '',
  status: 'draft',
  postMedia: [],
};
