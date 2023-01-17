import Partners from './components/section/Partners';
import Resource from './components/section/Resource';
import Section1 from './components/section/section1';
import Section2 from './components/section/section2';
import Service from './components/section/Service';

function Home() {
  return (
    <div className="mt-16 container">
      <Section1 />
      <Section2 />
      <Service />
      <Partners />
      <Resource />
    </div>
  );
}
export default Home;
