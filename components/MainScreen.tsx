import React, {useContext} from 'react';
import {ContainerContext} from '../contexts/ContainerContext';
import Container from './Container';
import {Login} from './Login';

const MainScreen = () => {
  const {
    state: {logged},
  } = useContext(ContainerContext);
  return (
    <>
      {!logged && <Login key="login" />}
      {logged && <Container key="container" />}
    </>
  );
};
export default MainScreen;
