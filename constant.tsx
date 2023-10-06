let language: string = "";

const languageCurrentInitialize = {
  get: () => language,
  set: (newLanguage: string) => {
    language = newLanguage;
  }
};

export default languageCurrentInitialize;
