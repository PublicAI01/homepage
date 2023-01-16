import { Typography } from '@douyinfe/semi-ui';
import { LinearGradientCard } from './components/LinearGradientCard';
import LinearGradientText from './components/LinearGradientText';

function Home() {
  return (
    <div className="mt-16">
      <div className="flex items-center">
        <div className="w-3/5">
          <LinearGradientText text={<>All Work <br />  On-Chain.</>} />
          <Typography.Text>A permissionless protocol to facilitate the exchange of MarkerDAO work, knowledge, and contribution.</Typography.Text>
          <button>
            Get Started
          </button>
          <LinearGradientCard
            className="w-[200px] h-[250px]"
            title="Quality Control"
            text={<>Content</>}
            border="linear-gradient(to right, #CBFF5E, #00E5FF)"
          />
        </div>
      </div>
    </div>
  );
}
export default Home;
