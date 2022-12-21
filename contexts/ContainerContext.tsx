import React from 'react';
import {EtendoUtil} from '../helpers/Etendo';

export const ContainerContext = React.createContext<{
  state: any;
  dispatch: any;
  Etendo: EtendoUtil;
}>({});
