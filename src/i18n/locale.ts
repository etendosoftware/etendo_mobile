import * as config from "./config";
import i18n from "i18n-js";
// @ts-ignore
import { enUS, esES, format, parseISO } from "date-fns";
import { References } from "../constants/References";

const Localization = {
  locale: "en-US"
};
const fallbackLanguage = "en-US";
const fallbackDateLocale = enUS;
const dateLocales = { enUS, esES };

const locale = {
  currentDateLocale: null,

  i18n,
  init() {
    i18n.locale = "en-US";
    i18n.fallbacks = true;
    i18n.defaultLocale = fallbackLanguage;
    i18n.translations = {};

    // Load fallback translation
    if (config.supportedLocales[Localization.locale]) {
      i18n.translations[Localization.locale] = config.supportedLocales[
        Localization.locale
      ].loadTranslations();
      this.currentDateLocale =
        dateLocales[Localization.locale.replace("-", "")];
    } else {
      i18n.translations[fallbackLanguage] = config.supportedLocales[
        fallbackLanguage
      ].loadTranslations();
      this.currentDateLocale = dateLocales[fallbackLanguage.replace("-", "")];
    }
  },
  initTranslation() {
    // Load fallback translation
    if (config.supportedLocales[Localization.locale]) {
      i18n.translations[Localization.locale] = config.supportedLocales[
        Localization.locale
      ].loadTranslations();
    } else {
      i18n.translations[fallbackLanguage] = config.supportedLocales[
        fallbackLanguage
      ].loadTranslations();
      this.currentDateLocale = dateLocales[fallbackLanguage.replace("-", "")];
    }
  },

  t(trl, params?): string {
    return i18n.t(trl, params);
  },

  setCurrentLanguage(input) {
    const newLocal = input.replace("_", "-");
    i18n.locale = newLocal;
    i18n.translations = {};
    if (config.supportedLocales[newLocal]) {
      i18n.translations[newLocal] = config.supportedLocales[
        newLocal
      ].loadTranslations();
    }
  },
  setLocal(locale) {
    const newLocal = locale.replace("_", "-");
    i18n.locale = newLocal;
  },
  formatDate(date, formatStr) {
    try {
      return format(date, formatStr, { locale: this.getDeviceLocaleForDate() });
    } catch (error) {
      throw new Error(
        `${error.message} - Params: Date: ${date} - Format String: ${formatStr}`
      );
    }
  },

  parseISODate(date) {
    return parseISO(date);
  },

  // TODO this should grab format from server
  getServerDateFormat(ref) {
    switch (ref) {
      case References.Time:
      case References.AbsoluteTime:
        return "HH:mm:ss";
      case References.DateTime:
        return "yyyy-MM-dd'T'HH:mm:ssxxx";
      case References.Date:
        return "yyyy-MM-dd";
      default:
        return "yyyy-MM-dd'T'HH:mm:ssxxx";
    }
  },

  getUIDateFormat(ref) {
    switch (ref) {
      case References.Time:
      case References.AbsoluteTime:
        return "HH:mm";
      case References.DateTime:
        return "yyyy-MM-dd HH:mm:ss";
      case References.Date:
        return "yyyy-MM-dd";
      default:
        return "yyyy-MM-dd HH:mm:ss";
    }
  },

  getDeviceLocale() {
    if (config.supportedLocales[Localization.locale]) {
      i18n.translations[Localization.locale] = config.supportedLocales[
        Localization.locale
      ].loadTranslations();
      return i18n.locale;
    } else {
      i18n.translations[fallbackLanguage] = config.supportedLocales[
        fallbackLanguage
      ].loadTranslations();
      return fallbackLanguage;
    }
  },

  getDeviceLocaleForDate() {
    return this.currentDateLocale || fallbackDateLocale;
  }
};

export default locale;
