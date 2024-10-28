import React, { useMemo, Suspense } from "react";
import { fetchComponent, getBasePathContext } from "../utils";
import LoadingScreen from "./LoadingScreen";

const DynamicComponent = ({ __id, children, ...props }: any) => {
  const baseUrl = props.url;
  const basePathContext = getBasePathContext(props.isDev);

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

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props}>{children}</Component>
    </Suspense>
  );
};

export default DynamicComponent;
