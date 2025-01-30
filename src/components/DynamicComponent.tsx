import React, { useMemo, Suspense } from 'react';
import { fetchComponent, getBasePathContext } from '../utils';
import LoadingScreen from './LoadingScreen';
import { useSelector } from 'react-redux';
import { selectContextPathUrl } from '../../redux/user';

const DynamicComponent = ({ __id, children, ...props }) => {
  const baseUrl = props.url;
  const localContextPath = useSelector(selectContextPathUrl)
  const basePathContext = getBasePathContext(props.isDemoTry, props.isDev, localContextPath);

  const Component = useMemo(() => {
    return React.lazy(async () => {
      try {
        const componentPromise = await fetchComponent(
          __id,
          `${baseUrl}${basePathContext}`,
          props.navigationContainer
        );
        return componentPromise;
      } catch (error) {
        console.error("Error to fetch component:", error);
        throw error;
      } finally {
        console.info("fetch done !!!");
      }
    });
  }, [__id, baseUrl, basePathContext]);

  if (!props.url || !localContextPath) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props}>{children}</Component>
    </Suspense>
  );
};

export default DynamicComponent;
