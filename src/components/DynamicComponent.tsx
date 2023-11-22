import React, { useMemo, Suspense } from "react";
import { fetchComponent, getBasePathContext } from "../utils";
import LoadingScreen from "./LoadingScreen";

const DynamicComponent = ({ __id, children, ...props }: any) => {
  const baseUrl = props.url;
  const basePathContext = getBasePathContext(props.isDemoTry, props.isDev);

  const Component = useMemo(() => {
    const component = async () => {
      const componentPromise = fetchComponent(
        __id,
        `${baseUrl}${basePathContext}`,
        props.navigationContainer
      );
      componentPromise.catch((e) => {
        console.error(e);
      });
      componentPromise.finally(() => {
        console.info("fetch done !!!");
      });
      return componentPromise;
    };
    return React.lazy(component);
  }, [__id]);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props}>{children}</Component>
    </Suspense>
  );
};

export default DynamicComponent;
