import React from 'react';

export const loadLazy = (pagesPath) => React.lazy(() => import(`../pages/${pagesPath}`));
