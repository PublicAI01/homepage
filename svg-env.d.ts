declare module '*.svg?react' {
  import { ComponentProps, FunctionComponent } from 'react';
  const content: FunctionComponent<ComponentProps<'svg'>>;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
