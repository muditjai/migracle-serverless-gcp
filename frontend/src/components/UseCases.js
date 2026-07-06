import React, { useState } from 'react';
import { TrendingDown, ArrowRightLeft, Layers } from 'lucide-react';

const UseCases = () => {
  const [selectedCase, setSelectedCase] = useState(0); // Start with first use case selected

  const useCases = [
    {
      icon: <TrendingDown className="w-6 h-6 text-white" />,
      title: "Optimize Your Existing Stack",
      description: "End-to-end optimization across containers, token spend, storage, data warehouses, application logic, architecture, and data pipelines. Functional and SLA parity verified. Lower total cost.",
      image: "./assets/images/region-expansion.jpg"
    },
    {
      icon: <ArrowRightLeft className="w-6 h-6 text-white" />,
      title: "Migrate to a New Cloud",
      description: "Use your startup credits ($100k–$350k) on a fresh provider, or move to a better rate (e.g. AWS → GCP). Complete migration end-to-end with full functional and SLA parity.",
      image: "./assets/images/cloud-migration.jpg"
    },
    {
      icon: <Layers className="w-6 h-6 text-white" />,
      title: "Both — Compound the Savings",
      description: "Optimize the current stack first, then move it to the cheaper provider to compound the savings. Parity guaranteed at every step. Outcome-based, one-time payment.",
      image: "./assets/images/multi-cloud.jpg"
    }
  ];

  return (
    <section className="mission">
      <div className="container mx-auto px-4">
        <div className="mission-label mb-6">How We Help</div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative h-96 bg-[#181818] rounded-xl overflow-hidden border border-white/10">
              <img
                src={useCases[selectedCase].image}
                alt={useCases[selectedCase].title}
                className="w-full h-full object-cover transition-all duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>

          {/* Right side - Use Cases */}
          <div className="md:w-1/2 space-y-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-xl cursor-pointer transition-all duration-300 ease-out
                  ${selectedCase === index ?
                    'scale-110 bg-white/10 border-2 border-white/30 shadow-xl shadow-white/5' :
                    'border border-white/5 hover:bg-white/5'
                  }`}
                onClick={() => setSelectedCase(index)}
              >
                {/* Glowing border effect for selected case */}
                {selectedCase === index && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 blur-xl -z-10" />
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg transition-colors duration-300 ${
                    selectedCase === index ? 'bg-white/20' : 'bg-white/5'
                  }`}>
                    {useCase.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                      selectedCase === index ? 'text-white' : 'text-white/70'
                    }`}>
                      {useCase.title}
                    </h3>
                    <p className={`leading-relaxed transition-colors duration-300 ${
                      selectedCase === index ? 'text-white/90' : 'text-white/50'
                    }`}>
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
