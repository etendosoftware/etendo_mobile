import React, { useMemo, useState, Suspense } from 'react';
import { fetchComponent, getBasePathContext } from '../utils';
import LoadingScreen from './LoadingScreen';
import SubAppErrorBoundary from './SubAppErrorBoundary';
import { useSelector } from 'react-redux';
import { selectContextPathUrl } from '../../redux/user';

const DynamicComponent = ({ __id, children, ...props }) => {
  const baseUrl = props.url;
  const localContextPath = useSelector(selectContextPathUrl)
  const basePathContext = getBasePathContext(props.isDemoTry, props.isDev, localContextPath);
  // Bumped on retry to rebuild the lazy component and download the bundle again
  const [retryKey, setRetryKey] = useState(0);

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
  }, [__id, baseUrl, basePathContext, retryKey]);

  if (!props.url || !localContextPath) {
    return <LoadingScreen />;
  }

  return (
    <SubAppErrorBoundary onRetry={() => setRetryKey(k => k + 1)}>
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props}>{children}</Component>
      </Suspense>
    </SubAppErrorBoundary>
  );
};

export default DynamicComponent;
