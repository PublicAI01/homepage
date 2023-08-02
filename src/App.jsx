import {
  BrowserRouter,
} from 'react-router-dom';
import { LocaleProvider } from '@douyinfe/semi-ui';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import { SWRConfig } from 'swr';
import Providers from './provider';
import axios from './utils/ajax';
import Routes from './router/index';
import 'aos/dist/aos.css';

const fetcher = (options) => axios({
  method: 'GET',
  ...options,
}).then((res) => {
  if (res.code === 200) {
    return res.data;
  }
  throw res;
});

function App() {
  return (
    <SWRConfig value={{
      errorRetryCount: 0,
      revalidateOnFocus: false,
      fetcher,
    }}
    >
      <LocaleProvider locale={en_US}>
        <Providers>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </Providers>
      </LocaleProvider>
    </SWRConfig>
  );
}

export default App;
