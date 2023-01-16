import { useRoutes } from 'react-router';
import * as reactIs from 'react-is';
import React from 'react';
import { routersConfig } from './config';

const getLayoutComponent = (item) => {
  const { layout: Layout } = item;
  if (reactIs.isValidElementType(Layout)) return Layout;
  return ({ children }) => children;
};

const wrapper = (configItem) => {
  const { element: Child, cutonFallBack } = configItem;
  const Layout = getLayoutComponent(configItem);
  if (reactIs.isElement(Child)) { // element
    return <Layout>{Child}</Layout>;
  }
  if (reactIs.isValidElementType(Child)) {
    // class or function component
    return (<Layout><Child /></Layout>);
  }
  return ( // lazy component
    <React.Suspense fallback={cutonFallBack || <>...</>}>
      <Layout>
        <Child />
      </Layout>
    </React.Suspense>
  );
};

const config = routersConfig.map((item) => ({
  ...item,
  element: wrapper(item),
}));

export default () => useRoutes(config);
