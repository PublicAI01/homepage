import { Footer } from './components/section/Footer';
import FQ from './components/section/FQ';
import Partners from './components/section/Partners';
import Resource from './components/section/Resource';
import Roadmap from './components/section/Roadmap';
import Section1 from './components/section/section1';
import Section2 from './components/section/section2';
import { Section3 } from './components/section/section3';
import Service from './components/section/Service';

function Home() {
  return (
    <div className="mt-16 container">
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
