import React from 'react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">Our mission</div>
        <h2 className="text-2xl text-white mb-12">Cut Your Cloud Bill Across the Infra and Application Layers</h2>
        <p>
          We implement optimization across application architecture, data pipelines,
          AI usage, and cloud infrastructure &mdash; not just a finops dashboard with
          recommendations. Every change is extensively tested and validated for 100%
          functional and SLA parity against your pre-change state. You get a lower
          cloud bill with no overhead for your engineering team.
        </p>
      </div>
    </section>
  );
};

export default Mission;
