import { lazy } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';

export const routersConfig = [{
  path: '/',
  layout: BaseLayout,
  element: lazy(() => import('../../pages/home/index.jsx')),
}];
