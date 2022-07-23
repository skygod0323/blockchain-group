import * as EN from './en.json';
import * as IN from './in.json';

const localization = {
    en: EN,
    in: IN,
}

export const LANGUAGES = {
    en: 'ENGLISH',
    in: 'INDONESIAN',
}

export function translate(word, lang = 'en') {
    return localization[lang][word] || word;
}
