import React, { useMemo, Suspense } from "react";
import { Text, View } from "react-native";
import { fetchComponent } from "./utils";

const DynamicComponent = ({ __id, url, children, ...props }: any) => {
  const Component = useMemo(() => {
    const component = async () => {
      const componentPromise = fetchComponent(__id, url);
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
    <Suspense
      fallback={
        <View>
          <Text>Loading...</Text>
        </View>
      }
    >
      <Component {...props}>{children}</Component>
    </Suspense>
  );
};

export default DynamicComponent;
