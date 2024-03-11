import Aos from 'aos';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import ActiveFQContext from './ActiveFQContext';
import FQ from './components/section/FQ';
import { Footer } from './components/section/Footer';
import Partners from './components/section/Partners';
import Resource from './components/section/Resource';
import Roadmap from './components/section/Roadmap';
import Service from './components/section/Service';
import Section1 from './components/section/section1';
import Section2 from './components/section/section2';
import Section3 from './components/section/section3';
import { Tokenomics } from './components/section/tokenomics';

function Home() {
  const wrapRef = useRef();
  useEffect(() => {
    Aos.init({
      delay: 100,
      anchorPlacement: 'bottom-bottom',
      offset: 200,
    });
    setTimeout(() => {
      if (wrapRef.current) {
        const navs = document.querySelectorAll('.header__nav');
        const wraps = wrapRef.current.querySelectorAll('.section-wrap[id]');
        const handleNavClass = (nav) => {
          const preEl = nav.previousElementSibling;
          const nextEl = nav.nextElementSibling;
          if (preEl && preEl.classList.contains('active')) {
            preEl.classList.remove('active');
          }
          if (nextEl && nextEl.classList.contains('active')) {
            nextEl.classList.remove('active');
          }
          if (!nav.classList.contains('active')) {
            nav.classList.add('active');
            return true;
          }
        };
        const onScroll = () => {
          const { scrollY } = window;
          // eslint-disable-next-line for-direction
          for (let i = wraps.length - 1; i >= 0; i -= 1) {
            const wrap = wraps[i];
            const nav = navs[i];
            const navMobile = navs[i + navs.length / 2];
            if (wrap.offsetTop - 100 <= scrollY) {
              handleNavClass(nav);
              handleNavClass(navMobile);
              return;
            }
          }
        };
        // const onHashChange = ({ newURL }) => {
        //   const hash = newURL.split('#')[1] || '';
        //   if (!hash) return window.scrollTo(0, 0);
        //   // console.log(has);
        // };
        document.addEventListener('scroll', onScroll);
        // window.addEventListener('hashchange', onHashChange);
        return () => {
          // window.removeEventListener('hashchange', onHashChange);
          document.removeEventListener('scroll', onScroll);
        };
      }
    }, 100);
  }, []);

  const [activeFQ, setActiveFQ] = useState(null);
  const value = useMemo(() => ({ activeFQ, setActiveFQ }), [activeFQ]);

  return (
    <ActiveFQContext.Provider value={value}>
      <div className="scroll-smooth" ref={wrapRef}>
        <Section1 />
        <Section2 />
        <Resource />
        <Section3 />
        <Service />
        <Roadmap />
        <Tokenomics />
        {/* <News /> */}
        <Partners />
        <FQ />
        <Footer />
      </div>
    </ActiveFQContext.Provider>
  );
}
export default Home;
