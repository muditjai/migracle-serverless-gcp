import React, { useState } from 'react';
import { Building2, Rocket, Sparkles, TrendingDown, DollarSign, CheckCircle } from 'lucide-react';

const CustomerPersonas = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const personas = [
    {
      id: 1,
      title: 'Public Companies & Enterprise SaaS',
      subtitle: 'Cutting Cloud Spend Without Risk',
      description: 'Optimize the existing stack end-to-end across containers, token spend, AI usage, storage, data warehouses, application logic, and architecture — with full functional and SLA parity verified.',
      image: './assets/images/enterprise-saas.jpg',
      icon: <Building2 className="w-5 h-5 text-white/70" />,
      challenges: [
        'Token spend (LLMs, AI workloads) growing faster than revenue',
        'SLA-sensitive workloads make big-bang rewrites risky',
        'Multi-account / multi-region sprawl makes cost hard to manage'
      ],
      benefits: [
        'End-to-end optimization that ships the changes',
        'Functional + SLA parity verified at every layer',
        'Outcome-based engagement — payment tied to results'
      ],
      metrics: [
        {
          icon: <TrendingDown className="w-5 h-5 text-white/70 mb-2" />,
          value: '5–10×',
          label: 'Year-1 ROI'
        },
        {
          icon: <CheckCircle className="w-5 h-5 text-white/70 mb-2" />,
          value: 'Verified',
          label: 'SLA Parity'
        }
      ]
    },
    {
      id: 2,
      title: 'Growth-Stage Companies',
      subtitle: 'Reduce Spend. Keep Focus on the Product.',
      description: 'We do the work so your team doesn\'t have to. 4–5 meetings end-to-end, milestone-based one-time payment, no long-term contract.',
      image: './assets/images/growth-isv.jpg',
      icon: <Rocket className="w-5 h-5 text-white/70" />,
      challenges: [
        'Cloud bill growing faster than infra headcount',
        'Limited eng bandwidth to run a migration',
        'Burn runway extending, not the product'
      ],
      benefits: [
        'Done-for-you optimization and/or migration',
        '4–5 meetings — your team stays focused on the product',
        'Milestone-based, one-time payment'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '60%+',
          label: 'Cost Reduction'
        },
        {
          icon: <Building2 className="w-5 h-5 text-white/70 mb-2" />,
          value: '4–5',
          label: 'Meetings Total'
        }
      ]
    },
    {
      id: 3,
      title: 'Startups with Cloud Credits',
      subtitle: 'Use Your $100k–$350k Before It Expires',
      description: 'Migrate to a new cloud provider end-to-end so you can deploy against your startup credits. Full functional and SLA parity, production-ready on day one.',
      image: './assets/images/startup-credits.jpg',
      icon: <Sparkles className="w-5 h-5 text-white/70" />,
      challenges: [
        'Credits expiring unused on the current platform',
        'Team unfamiliar with the destination provider',
        'Migration feels like a quarter-long distraction'
      ],
      benefits: [
        'End-to-end migration done for you',
        'Use your credits before they expire',
        'Production-ready on the target provider'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '$100–350K',
          label: 'Credits Used'
        },
        {
          icon: <CheckCircle className="w-5 h-5 text-white/70 mb-2" />,
          value: 'Verified',
          label: 'Functional Parity'
        }
      ]
    }
  ];

  return (
    <section className="mission">
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">Who We Help</div>
        <h2 className="text-2xl text-white mb-12">
          Built for Teams That Want a Lower Cloud Bill
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
