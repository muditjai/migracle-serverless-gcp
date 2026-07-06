import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {

  return (
    <section className="mission relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />

      <div className="container mx-auto px-4 relative">
        <div className="cta-image-container mb-8">
          <img src="./assets/cta.png" alt="CTA decoration" className="w-full h-auto" />
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Want to know what your cloud bill could be?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Send us your current stack and spend. We'll send back a rough estimate
            of what optimization or migration could save&mdash;in 5 business days,
            no commitment.
          </p>

          <button
            onClick={() => {
                const modal = document.getElementById('contactModal');
                if (modal) modal.style.display = 'block';
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black
                rounded-xl font-semibold text-lg transition-colors hover:bg-white/90"
            >
            Get a free estimate
            <ArrowRight className="w-5 h-5" />
        </button>

        </div>

      </div>

    </section>
  );
};

export default CTA;
