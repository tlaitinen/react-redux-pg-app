export type Language = 'en' | 'fi';
export type Messages = {[key:string]:string};
export const languages:{[lang in Language]:Messages} = {
  fi: require('../locale/fi/LC_MESSAGES/messages.po'),
  en: require('../locale/en/LC_MESSAGES/messages.po')
};

