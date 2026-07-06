import React from 'react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">The Migracle Difference</div>
        <h2 className="text-2xl text-white mb-12">Engineering the Cost Out of Your Cloud Stack</h2>
        <p>
          Most FinOps platforms stop at recommendations, leaving your engineering team to find, test, and ship the fixes. We do the actual work. Migracle optimizes your entire stack—re-engineering application code, refactoring data pipelines, optimizing LLM token spend, and tuning infrastructure. We validate every single pull request with rigorous pre-and-post automated testing to guarantee complete functional and SLA parity.
        </p>
      </div>
    </section>
  );
};

export default Mission;
