import { Layout } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import Header from '../Header';

function BaseLayout(props) {
  const { children, className, contentClassName } = props;
  return (
    <Layout className={classNames('h-full', className)}>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content className={classNames('bg-black/10 nmd:relative pt-[120px]', contentClassName)}>
        {children}
      </Layout.Content>
    </Layout>
  );
}

export default BaseLayout;
