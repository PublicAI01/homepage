import { useEffect, useRef } from 'react';
import { Footer } from './components/section/Footer';
import FQ from './components/section/FQ';
import Partners from './components/section/Partners';
import Resource from './components/section/Resource';
import Roadmap from './components/section/Roadmap';
import Section1 from './components/section/section1';
import Section2 from './components/section/section2';
import Section3 from './components/section/section3';
import Service from './components/section/Service';

function Home() {
  const wrapRef = useRef();
  useEffect(() => {
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
        document.addEventListener('scroll', onScroll);
        return () => {
          document.removeEventListener('scroll', onScroll);
        };
      }
    }, 100);
  }, []);
  return (
    <div className="container scroll-smooth" ref={wrapRef}>
      <Section1 />
      <Section2 />
      <Section3 />
      <Service />
      <Roadmap />
      <Partners />
      <FQ />
      <Resource />
      <Footer />
    </div>
  );
}
export default Home;
