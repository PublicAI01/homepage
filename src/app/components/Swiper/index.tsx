const Swiper = () => {
  return (
    <div className="flex items-center md:w-2/3">
      <div
        dir="rtl"
        className="relative overflow-y-scroll h-36 snap-y snap-mandatory scrollbar scrollbar-thumb-rounded-full scrollbar-w-1 scrollbar-track-rounded-full scrollbar-track-white/10 scrollbar-thumb-primary">
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
            className="flex flex-col justify-between ml-6 h-36 snap-center snap-always">
            <h5 className="text-2xl md:text-4xl font-bold text-white transition-colors">
              {item.title}
            </h5>
            <p className="text-sm font-medium text-white transition-colors">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Swiper;
