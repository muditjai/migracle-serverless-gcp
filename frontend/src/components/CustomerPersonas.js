import React, { useState } from 'react';
import { Building2, Rocket, Sparkles, Globe, TrendingUp, Zap, CheckCircle, Clock, DollarSign } from 'lucide-react';

const CustomerPersonas = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const personas = [
    {
      id: 1,
      title: 'Enterprise SaaS Vendors',
      subtitle: 'Global Expansion & Data Sovereignty',
      description: 'Expand globally while meeting data residency requirements. Automated Terraform modules for compliance-ready deployments.',
      image: './assets/images/case1.jpeg',
      icon: <Building2 className="w-5 h-5 text-white/70" />,
      challenges: [
        'Manual infrastructure recreation for each region',
        'Region-specific hardcodings in Terraform',
        'Compliance delays blocking market entry'
      ],
      benefits: [
        'Automated Terraform modules for any region',
        'Compliance-ready deployments out of the box',
        'Faster go-to-market in new geographies'
      ],
      metrics: [
        {
          icon: <Globe className="w-5 h-5 text-white/70 mb-2" />,
          value: '75%',
          label: 'Faster Expansion'
        },
        {
          icon: <TrendingUp className="w-5 h-5 text-white/70 mb-2" />,
          value: '5X',
          label: 'More Regions/Year'
        }
      ]
    },
    {
      id: 2,
      title: 'Growth-Stage ISVs',
      subtitle: 'Scale Without Growing the Team',
      description: 'Meet enterprise customer requirements for specific regions and clouds without hiring more infrastructure engineers.',
      image: './assets/images/case2.jpeg',
      icon: <Rocket className="w-5 h-5 text-white/70" />,
      challenges: [
        'Small infrastructure team stretched thin',
        'Customer demands for specific regions/clouds',
        'Manual process blocking sales deals'
      ],
      benefits: [
        'Expand to new regions without hiring',
        'Meet customer requirements in weeks',
        'Fully tested deployments every time'
      ],
      metrics: [
        {
          icon: <DollarSign className="w-5 h-5 text-white/70 mb-2" />,
          value: '60%',
          label: 'Cost Savings'
        },
        {
          icon: <Zap className="w-5 h-5 text-white/70 mb-2" />,
          value: '90%',
          label: 'Less Manual Work'
        }
      ]
    },
    {
      id: 3,
      title: 'Startups with Cloud Credits',
      subtitle: 'Maximize Your $250-350K Credits',
      description: 'Replicate your existing infrastructure to a new cloud provider fast. Go production-ready and maximize credit utilization.',
      image: './assets/images/case3.jpeg',
      icon: <Sparkles className="w-5 h-5 text-white/70" />,
      challenges: [
        'Credits expiring unused on new platform',
        'Unfamiliar cloud provider and services',
        'Rebuilding infrastructure from scratch'
      ],
      benefits: [
        'Replicate existing infra to new provider',
        'Maximize credit utilization before expiry',
        'Production-ready on day one'
      ],
      metrics: [
        {
          icon: <CheckCircle className="w-5 h-5 text-white/70 mb-2" />,
          value: '90%',
          label: 'Credit Utilization'
        },
        {
          icon: <Clock className="w-5 h-5 text-white/70 mb-2" />,
          value: '10X',
          label: 'Faster Go-Live'
        }
      ]
    }
  ];

  return (
    <section className="mission">
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">Who We Help</div>
        <h2 className="text-2xl text-white mb-12">
          Built for Software Vendors Ready to Expand
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
