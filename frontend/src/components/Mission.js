import React from 'react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">Our mission</div>
        <h2 className="text-2xl text-white mb-12">Lower bill. Same services. SLA-verified.</h2>
        <p>
          We change your code, your infrastructure, and your data pipelines&mdash;not just
          your dashboard. Every change is tested against your pre-change behavior: same
          functionality, same latency, same error rate. You get a working system with a
          lower bill. Not a list of action items for your team to action.
        </p>
      </div>
    </section>
  );
};

export default Mission;
