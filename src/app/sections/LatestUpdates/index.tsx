import { getBlogPosts } from '@/app/blog/utils';
import Swiper from '@/app/sections/LatestUpdates/components/Swiper';
import SectionWrapper from '@/components/SectionWrapper';

const LatestUpdates = async () => {
  const allBlogs = await getBlogPosts();

  const blogs = allBlogs.map(({ MDX, ...rest }) => ({ ...rest }));

  return (
    <SectionWrapper
      title="Latest Updates"
      anchorId="latest-updates">
      <Swiper blogs={blogs} />
    </SectionWrapper>
  );
};

export default LatestUpdates;
