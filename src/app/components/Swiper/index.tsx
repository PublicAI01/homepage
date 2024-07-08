const Swiper = () => {
  return (
    <div className="flex items-center md:w-2/3">
      <div
        dir="rtl"
        className="relative h-36 snap-y snap-mandatory overflow-y-scroll scrollbar scrollbar-track-white/10 scrollbar-thumb-primary scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-1">
        {[
          {
            title: 'Data Collection',
            content:
              'AI Builders are sourcing and curating high-quality content from social media. Use the Data Hunter plugin to contribute social media and GPT conversation content.',
          },
          {
            title: 'Data Labeling',
            content:
              'Deliver high-quality, cost-effective data labeling through an AI-assisted workflow featuring pre labeling by AI Assistants and thorough verification by AI Validators.',
          },
          {
            title: 'Model Evaluation',
            content:
              'Analyze the performance of your AI models. Explore model metrics, identify model weaknesses and evaluate your model on scenario tests.',
          },
        ].map((item, index) => (
          <div
            dir="auto"
            key={index}
            className="ml-6 flex h-36 snap-center snap-always flex-col justify-between py-2">
            <h5 className="text-xl font-bold text-white transition-colors md:text-4xl">
              {item.title}
            </h5>
            <p className="text-sm font-medium text-white transition-colors md:text-lg">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Swiper;
