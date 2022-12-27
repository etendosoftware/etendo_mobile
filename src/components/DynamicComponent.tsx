import React, { useMemo, Suspense } from 'react';
import { Text, View } from 'react-native';
import { fetchComponent } from "./utils";

const DynamicComponent = ({ __id, url, children, ...props }: any) => {
    const Component = useMemo(() => {
        const component = async () => {
          const c = fetchComponent(__id, url);
          c.catch(e => {
            console.error(e)
          })
          c.finally( () => {
            console.log("fetch done !!!")
          })
          return c;
        };
        return React.lazy(component)
    }, [__id]);
    return (
        <Suspense fallback={<View><Text>Loading...</Text></View>}>
            <Component {...props}>{children}</Component>
        </Suspense>
    )
};

export default DynamicComponent;