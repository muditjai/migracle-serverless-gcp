import React, { useState } from 'react';
import { Building2, Rocket, Sparkles, TrendingDown, DollarSign, CheckCircle, Clock, Zap } from 'lucide-react';

const CustomerPersonas = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const personas = [
    {
      id: 1,
      title: 'Enterprise & Public Companies',
      subtitle: 'De-Risk Cloud Cost Reduction at Scale',
      description: 'Lower your infrastructure and SaaS bills without disrupting critical, high-traffic systems. Every code modification is covered by automated regression testing to guarantee complete performance and SLA parity.',
      image: './assets/images/enterprise-saas.jpg',
      icon: <Building2 className="w-5 h-5 text-white/70" />,
      challenges: [
        'CFO demands to cut soaring cloud spend.',
        'High-traffic workloads cannot tolerate deployment risk.',
        'FinOps team buried in dashboards, lacking dev bandwidth.'
      ],
      benefits: [
        'Hands-on compute, database, and warehouse refactoring.',
        'SLA parity guarantee verified by load testing.',
        'Auditable ledger of 5–10× first-year ROI.'
      ],
      metrics: [
        {
          icon: <TrendingDown className="w-5 h-5 text-white/70 mb-2" />,
          value: '5–10×',
          label: 'Year-1 ROI'
        },
        {
          icon: <CheckCircle className="w-5 h-5 text-white/70 mb-2" />,
          value: 'Pre/Post',
          label: 'Guaranteed Parity'
        }
      ]
    },
    {
      id: 2,
      title: 'Growth-Stage Companies',
      subtitle: 'Extend Runway Without Sacrificing Velocity',
      description: 'Your team needs to focus on shipping revenue-generating features, not refactoring resources. We take the entire optimization workload off your plate—requiring just 4–5 alignment meetings in total.',
      image: './assets/images/growth-isv.jpg',
      icon: <Rocket className="w-5 h-5 text-white/70" />,
      challenges: [
        'Urgent need to lower burn and extend runway.',
        'Maxed-out SRE team has no bandwidth for cost sprints.',
        'Reluctance to stall feature roadmap for refactoring.'
      ],
      benefits: [
        'We write and ship the PRs—your team just reviews.',
        'Minimal overhead: 4–5 alignment meetings total.',
        'Milestone fees tied directly to verified savings.'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '60–80%',
          label: 'Bill Reduction'
        },
        {
          icon: <Clock className="w-5 h-5 text-white/70 mb-2" />,
          value: '4–5',
          label: 'Meetings Total'
        }
      ]
    },
    {
      id: 3,
      title: 'Startups with Expiring Credits',
      subtitle: 'Unlock $100k–$350k in Fresh Runway',
      description: 'Stop letting unused cloud credits expire on AWS, GCP, or Azure. We migrate your architecture end-to-end to the new provider within weeks, ensuring a seamless cutover and identical behavior.',
      image: './assets/images/startup-credits.jpg',
      icon: <Sparkles className="w-5 h-5 text-white/70" />,
      challenges: [
        'Unused cloud credits expiring on another provider.',
        'No internal SREs to spare for a migration.',
        'Lacking deep expertise in the destination cloud.'
      ],
      benefits: [
        'End-to-end migration handled entirely by us.',
        'Production-ready on the new cloud in weeks.',
        'Guaranteed performance and SLA parity on day one.'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '$100–350k',
          label: 'Fresh Runway'
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
        <div className="mission-label mb-6">Target Audiences</div>
        <h2 className="text-2xl text-white mb-12">
          Tailored cloud cost engineering, no matter your scale.
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
