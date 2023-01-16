import BaseLayout from '@/components/layout/BaseLayout';
import { loadLazy } from '../helper';

export const routersConfig = [{
  path: '/',
  layout: BaseLayout,
  element: loadLazy('home/index'),
}];
