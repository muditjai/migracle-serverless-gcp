import React, { useEffect, useRef, useState } from 'react';
import { TrendingDown, ShieldCheck, Rocket } from 'lucide-react';

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
      icon: <TrendingDown className="w-6 h-6 text-white" />,
      title: "End-to-End Stack Optimization",
      description: "We cover containers, token spend, storage, data warehouses, application logic, architecture, and data pipelines — not a single slice, not a dashboard.",
      metric1: {
        value: "All 5",
        label: "Layers"
      },
      metric2: {
        value: "100%",
        label: "Stack Coverage"
      }
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Functional & SLA Parity, Verified",
      description: "Every change is validated against your pre-change state. You get a verified working system and a lower bill — not a list of action items.",
      metric1: {
        value: "100%",
        label: "Parity"
      },
      metric2: {
        value: "Verified",
        label: "At Every Layer"
      }
    },
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Outcome-Based, AI-Native",
      description: "Milestone-based, one-time payment. 4–5 meetings with your team. 5–10× ROI in year 1. No long-term contract, no retainer.",
      metric1: {
        value: "5–10×",
        label: "Year-1 ROI"
      },
      metric2: {
        value: "4–5",
        label: "Meetings"
      }
    }
  ];

  return (
    <section className="mission" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">Why Migracle</div>
        <h2 className="text-2xl text-white mb-12">
          What Sets Us Apart
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
