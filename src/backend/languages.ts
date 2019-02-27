import path from 'path';
import * as po2json from 'po2json';
import {Jed} from 'jed';
import {User, Language} from '../types/users';
function loadLanguage(language:Language) {
  return po2json.parseFileSync(
    path.join(__dirname, 'locale',language,'LC_MESSAGES','messages.po'),
    {format: 'jed1.x'}
  );
}

export const languages:{[lang in Language]:{[key:string]:string}} = {
  en: loadLanguage('en'),
  fi: loadLanguage('fi')
};

export const translations:{[lang in Language]:Jed} = {
  en: new Jed(languages.en),
  fi: new Jed(languages.fi)
};

export function userI18n(user:User):Jed {
  return translations[user.language];
}
