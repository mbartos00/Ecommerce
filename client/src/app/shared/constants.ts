import { FooterSection } from './footer/footer.component';

export const ACCESS_TOKEN_STORAGE_KEY = 'access_token';

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Information',
    links: [
      { title: 'About Us', url: '/link1' },
      { title: 'Products', url: '/link2' },
      { title: 'Our articles', url: '/link3' },
      { title: 'Your cart', url: '/link4' },
    ],
  },
];
