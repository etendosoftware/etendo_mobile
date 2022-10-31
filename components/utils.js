import React from 'react';
import {Text} from 'react-native';
import {Etendo} from '../helpers/Etendo';
import packages from './packages';

function getParsedModule(code, moduleName, packages) {
  const _this = Object.create(packages);
  function require(name) {
    if (!(name in _this) && moduleName === name) {
      let module = {exports: {}};
      _this[name] = () => module;
      let wrapper = Function('require, exports, module', code);
      wrapper(require, module.exports, module);
    } else if (!(name in _this)) {
      throw `Module '${name}' not found`;
    }
    return _this[name]().exports;
  }

  return require(moduleName);
}

export async function fetchComponent(id, url) {
  try {
    const urlToFetch = `${url}/${id}`;
    console.log('urlToFetch', urlToFetch);
    const text = await fetch(urlToFetch).then(a => {
      if (!a.ok) {
        throw new Error('Network response was not ok');
      }
      return a.text();
    });
    console.log(text);
    const component = {default: getParsedModule(text, id, packages)};
    console.log(component);
    //Object.keys(component.default).map(k => {
    Etendo.register('appId', component);
    //});
    return component.default;
  } catch (error) {
    console.log('fetchComponent', error);
    return {
      default() {
        return <Text>Failed to Render url "{url}"</Text>;
      },
    };
  }
}
