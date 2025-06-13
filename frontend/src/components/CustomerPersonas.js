import React, { useState } from 'react';
import { Cloud, Users, Code, Clock, Target, ArrowUp, Zap, CheckCircle, BarChart, Award } from 'lucide-react';

const CustomerPersonas = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const personas = [
    {
      id: 1,
      title: 'Software Platform Vendors',
      subtitle: 'Accelerate Revenue Realization',
      description: 'Transform your customer onboarding from a bottleneck into a revenue accelerator. Focus on product adoption and faster account expansion.',
      image: './assets/images/case1.jpeg',
      icon: <Cloud className="w-5 h-5 text-white/70" />,
      challenges: [
        'Long migration cycles slowing down sales',
        'Complex customer data transitions',
        'Resource-intensive onboarding process'
      ], 
      benefits: [
        'Reduce in migration-related churn',
        'Minimize migration-related support tickets',
        'Focus on strategic account expansion initiatives'
      ],
      metrics: [
        {
          icon: <Target className="w-5 h-5 text-white/70 mb-2" />,
          value: '70%',
          label: 'Faster Time to Revenue'
        },
        {
          icon: <ArrowUp className="w-5 h-5 text-white/70 mb-2" />,
          value: '4X',
          label: 'Account Penetration'
        }
      ]
    },
    {
      id: 2,
      title: 'Global System Integrators (GSIs)',
      subtitle: 'Optimize migration services',
      description: 'Expand your services while improving project margins. Transform migration services from labor-based to technology-enabled delivery.',
      image: './assets/images/case2.jpeg',
      icon: <Users className="w-5 h-5 text-white/70" />,
      challenges: [
        'Manual migration processes',
        'High resource requirements',
        'Complex project timelines'
      ],
      benefits: [
        'Achive higher project margins through automation',
        'Improve utilization of existing technical teams',
        '3-4X concurrent migrations without adding headcount'
      ],
      metrics: [
        {
          icon: <Zap className="w-5 h-5 text-white/70 mb-2" />,
          value: '60%',
          label: 'Higher Margins'
        },
        {
          icon: <CheckCircle className="w-5 h-5 text-white/70 mb-2" />,
          value: '90%',
          label: 'Reduction in Escalations'
        }
      ]
    },
    {
      id: 3,
      title: 'Platform Engineering Teams',
      subtitle: 'Modernize with Confidence',
      description: 'Accelerate infrastructure modernization initiatives and transform platform migrations from high-risk projects into routine operations. ',
      image: './assets/images/case3.jpeg',
      icon: <Code className="w-5 h-5 text-white/70" />,
      challenges: [
        'Legacy system dependencies',
        'Complex internal integrations',
        'Resource constraints'
      ],
      benefits: [
        'Transform migrations from projects to products',
        'Mitigate post-migration bugs and issues',
        'Minimize dependency on tribal knowledge'
      ],
      metrics: [
        {
          icon: <BarChart className="w-5 h-5 text-white/70 mb-2" />,
          value: '85%',
          label: 'Decrease in Downtime'
        },
        {
          icon: <Award className="w-5 h-5 text-white/70 mb-2" />,
          value: '95%',
          label: 'Fewer Rollbacks'
        }
      ]
    }
  ];

  return (
    <section className="mission">
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">Who We Help</div>
        <h2 className="text-2xl text-white mb-12">
          Built for Migration Leaders
        </h2>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {personas.map(persona => (
            <div
              key={persona.id}
              className={`group relative min-h-[480px] md:min-h-[480px] lg:min-h-[500px] xl:min-h-[450px] perspective-1000 cursor-pointer font-['Inter']`}
              onClick={() => setFlippedCard(flippedCard === persona.id ? null : persona.id)}
            >
              {/* Front of Card */}
              <div className={`absolute inset-0 rounded-xl p-6 bg-[#181818] border border-white/10 
                transition-all duration-500 backface-hidden ${
                flippedCard === persona.id ? 'rotate-y-180' : ''
              }`}>
                <div className="h-48 mb-4 rounded-lg overflow-hidden bg-white/5">
                  <img 
                    src={persona.image} 
                    alt={persona.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    {persona.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {persona.title}
                  </h3>
                </div>
                <p className="text-white/70 bottom-6">
                  {persona.description}
                </p>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white/50 text-sm">
                    Click to learn more
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className={`absolute inset-0 rounded-xl p-6 bg-[#181818] border border-white/10 
                transition-all duration-500 backface-hidden rotate-y-180 ${
                flippedCard === persona.id ? 'rotate-y-0' : ''
              }`}>
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    {persona.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {persona.metrics.map((metric, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        {metric.icon}
                        <div className="text-2xl font-bold text-white">
                          {metric.value}
                        </div>
                        <div className="text-sm text-white/70">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 flex-grow">
                    <div>
                      <div className="text-white/70 text-lg mb-3">
                        Key Benefits
                      </div>
                      <ul className="space-y-2">
                        {persona.benefits.map((benefit, index) => (
                          <li key={index} className="text-white/90 flex items-start gap-2">
                            <span className="text-white/30 mt-1">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 text-white/50 text-sm">
                    Click to flip back
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerPersonas;
