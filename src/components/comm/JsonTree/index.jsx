import classNames from 'classnames';
import { JSONTree } from 'react-json-tree';
import styled from 'styled-components';

const Wrap = styled.div`
  >ul {
    background-color: transparent !important;
  }
`;

const theme = {
  // scheme: 'monokai',
  // author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#F7CF95',
  base0B: '#FF7E7E',
  base0C: '#a1efe4',
  base0D: '#ffffff',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

function JsonTree(props) {
  const { selectKeyPath = [], onClickKey, onClickValue } = props;
  return (
    <Wrap className={props.className}>
      <JSONTree
        hideRoot
        theme={theme}
        invertTheme={false}
        // eslint-disable-next-line react/no-unstable-nested-components
        labelRenderer={(...args) => {
          const [keyPath] = args;
          const [key] = keyPath;
          return (
            <span
              // className={classNames('cursor-pointer hover:underline', {
              //   underline: selectKeyPath.join('.') === keyPath.join('.'),
              // })}
              onClick={() => {
                onClickKey && onClickKey(...args);
              }}
            >
              {key}:
            </span>
          );
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        valueRenderer={(...args) => {
          const [valueAsString, value, ...keyPath] = args;
          return (
            <span
              className={classNames('cursor-pointer hover:underline', {
                underline: selectKeyPath.join('.') === keyPath.join('.'),
              })}
              onClick={() => {
                const _args = [keyPath, valueAsString, value];
                onClickValue && onClickValue(..._args);
              }}
            >
              {valueAsString}
            </span>
          );
        }}
        {...props}
      />
    </Wrap>
  );
}

export default JsonTree;
