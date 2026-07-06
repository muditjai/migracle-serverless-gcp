import React, { useState } from 'react';
import { Building2, Rocket, Sparkles, TrendingDown, DollarSign, CheckCircle, Clock, Zap } from 'lucide-react';

const CustomerPersonas = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const personas = [
    {
      id: 1,
      title: 'Enterprise & Public Companies',
      subtitle: 'Reduce Cloud Spend Without Risk.',
      description: 'Cloud bill is up 40% YoY and the CFO wants it down. We cut the bill without breaking a single user-facing endpoint. Pre-change vs post-change, every service is tested for parity before we sign off.',
      image: './assets/images/enterprise-saas.jpg',
      icon: <Building2 className="w-5 h-5 text-white/70" />,
      challenges: [
        'Cloud bill up 40% YoY, the CFO is asking',
        'SLA-sensitive workloads can\'t take big-bang risks',
        'FinOps team is already drowning in dashboards'
      ],
      benefits: [
        'End-to-end optimization with zero SLA risk',
        'Average 5× ROI in year 1',
        'Functional, latency, and error-rate parity verified'
      ],
      metrics: [
        {
          icon: <TrendingDown className="w-5 h-5 text-white/70 mb-2" />,
          value: '5×',
          label: 'Year-1 ROI'
        },
        {
          icon: <CheckCircle className="w-5 h-5 text-white/70 mb-2" />,
          value: 'Pre/Post',
          label: 'Verified Parity'
        }
      ]
    },
    {
      id: 2,
      title: 'Growth-Stage Companies',
      subtitle: 'Lower the Cloud Bill. Ship the Product.',
      description: 'Bill is up, runway is down, and your infra team is already maxed. We do the optimization work in 4–5 meetings. Your engineering team keeps shipping the product.',
      image: './assets/images/growth-isv.jpg',
      icon: <Rocket className="w-5 h-5 text-white/70" />,
      challenges: [
        'Bill up, runway down',
        'Small infra team already maxed',
        'No quarter to spend on a migration'
      ],
      benefits: [
        'We do the work — your team keeps shipping the product',
        '4–5 meetings total across the engagement',
        'Outcome-based pricing tied to results, not hours'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '60–80%',
          label: 'Spend Reduction'
        },
        {
          icon: <Clock className="w-5 h-5 text-white/70 mb-2" />,
          value: '4–5',
          label: 'Meetings'
        }
      ]
    },
    {
      id: 3,
      title: 'Startups with Cloud Credits',
      subtitle: 'Spend the Credits. Land on the New Cloud.',
      description: '$100k–$350k in unused cloud credits on a new provider. We get you production-ready on that provider in weeks, with the same services and SLAs as today.',
      image: './assets/images/startup-credits.jpg',
      icon: <Sparkles className="w-5 h-5 text-white/70" />,
      challenges: [
        'Cloud credits expiring unused',
        'Don\'t know the destination cloud provider well',
        'Don\'t have eng bandwidth for a quarter-long migration'
      ],
      benefits: [
        'Production-ready on the new provider in weeks',
        'End-to-end migration, no internal hires needed',
        'Same functionality and SLA, day one'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '$100–350K',
          label: 'Credits Used'
        },
        {
          icon: <Zap className="w-5 h-5 text-white/70 mb-2" />,
          value: 'Weeks',
          label: 'To Production'
        }
      ]
    }
  ];

  return (
    <section className="mission">
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">Who We Work With</div>
        <h2 className="text-2xl text-white mb-12">
          For teams who want a lower cloud bill, fast.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {personas.map(persona => (
            <div
              key={persona.id}
              className={`group relative min-h-[480px] md:min-h-[480px] lg:min-h-[500px] xl:min-h-[450px] perspective-1000 cursor-pointer font-['Inter']`}
              onClick={() => setFlippedCard(flippedCard === persona.id ? null : persona.id)}
            >
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
                        What You're Up Against
                      </div>
                      <ul className="space-y-2">
                        {persona.challenges.map((challenge, index) => (
                          <li key={index} className="text-white/90 flex items-start gap-2">
                            <span className="text-white/30 mt-1">•</span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-white/70 text-lg mb-3">
                        What We Deliver
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
