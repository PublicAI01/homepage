'use client';

import 'overlayscrollbars/overlayscrollbars.css';

import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { useEffect, useRef } from 'react';

import styles from '@/app/components/Swiper/Swiper.module.css';
import { cn } from '@/utils';

const Swiper = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialize] = useOverlayScrollbars({
    options: {
      showNativeOverlaidScrollbars: false,
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
      scrollbars: {
        theme: styles['os-theme'],
        visibility: 'visible',
      },
    },
    defer: true,
  });

  useEffect(() => {
    if (containerRef.current) {
      initialize(containerRef.current);
    }
  }, [initialize]);

  return (
    <div className="flex items-center md:w-2/3">
      <div
        ref={containerRef}
        dir="rtl"
        className={cn('relative h-36', styles.container)}>
        {[
          {
            title: 'Data Collection',
            content:
              'AI Builders source and curate high-quality content from social media. Contribute social media and GPT conversation content using the Data Hunter plugin.',
          },
          {
            title: 'Data Labeling',
            content:
              'Deliver high-quality, cost-effective data labeling through an AI-assisted workflow: AI Assistants pre-label data, followed by thorough verification by AI Validators.',
          },
          {
            title: 'Model Evaluation',
            content:
              "Analyze your AI models' performance: explore model metrics, identify weaknesses, and evaluate models using scenario tests.",
          },
        ].map((item, index) => (
          <div
            dir="auto"
            key={index}
            className="ml-6 flex h-36 snap-center snap-always flex-col justify-between py-2">
            <h5 className="text-xl font-bold text-white transition-colors md:text-3xl lg:text-4xl">
              {item.title}
            </h5>
            <p className="text-sm font-medium text-white transition-colors md:text-base lg:text-lg">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Swiper;
