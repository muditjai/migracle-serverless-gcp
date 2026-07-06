import React, { useEffect, useRef, useState } from 'react';
import { Wrench, ShieldCheck, Rocket } from 'lucide-react';

const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
};

const FeatureCard = ({ feature, index, isVisible }) => {
  return (
    <div
      className={`group relative p-6 rounded-xl transition-all duration-500 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-white/5 to-white/[0.02]
        border border-white/10 hover:border-white/20`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/[0.05] to-transparent opacity-0
        group-hover:opacity-100 blur-xl transition-opacity -z-10" />

      <div className="flex flex-col h-full">
        {/* Icon with animated background */}
        <div className="relative w-12 h-12 mb-6">
          <div className="absolute inset-0 bg-white/10 rounded-lg transform rotate-3
            group-hover:rotate-6 transition-transform" />
          <div className="absolute inset-0 bg-white/5 rounded-lg transform -rotate-3
            group-hover:-rotate-6 transition-transform" />
          <div className="relative h-full rounded-lg bg-[#181818] flex items-center justify-center">
            {feature.icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          {feature.title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
        </h3>

        <p className="text-white/70 mb-6 flex-grow">
          {feature.description}
        </p>

        {/* Metrics */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-2xl font-bold text-white">
              {feature.metric1.value}
            </div>
            <div className="text-sm text-white/50">
              {feature.metric1.label}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-2xl font-bold text-white">
              {feature.metric2.value}
            </div>
            <div className="text-sm text-white/50">
              {feature.metric2.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  const features = [
    {
      icon: <Wrench className="w-6 h-6 text-white" />,
      title: "Hands-On Code & Infra Delivery",
      description: "We implement Terraform infra and architecture changes with detailed documentation, flag guards, and extensive test validation. Your engineering team's precious bandwidth remains focused on building your product.",
      metric1: {
        value: "100%",
        label: "Work Done by Us"
      },
      metric2: {
        value: "0",
        label: "New Backlog Items for You"
      }
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "100% Guaranteed SLA Parity",
      description: "We verify every change against pre-change baselines using automated load and regression tests. We guarantee identical functionality and SLA before anything is promoted to production.",
      metric1: {
        value: "100%",
        label: "Functional & SLA Parity"
      },
      metric2: {
        value: "Pre/Post",
        label: "Automated Parity Verification"
      }
    },
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Outcome-Based Milestone Pricing",
      description: "You pay a one-time, milestone-based fee tied directly to verified savings. No recurring subscription, no open-ended consulting bills, and a typical 5–10× ROI immediately.",
      metric1: {
        value: "5–10×",
        label: "Average ROI Immediately"
      },
      metric2: {
        value: "One-Time",
        label: "Milestones, No Retainers"
      }
    }
  ];

  return (
    <section className="mission" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">Engineered for Outcomes</div>
        <h2 className="text-2xl text-white mb-12">
          Built for teams who want outcomes, not recommendations.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
