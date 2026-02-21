import React from 'react';
import { Activity, Database, Zap } from 'lucide-react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">Our mission</div>
        <h2 className="text-2xl text-white mb-12">Accelerate Cloud Expansion for Software Vendors</h2>
        <p>We help ISVs expand into new cloud regions and providers. We modularize your Terraform, abstract region-specific hardcodings, and deploy with comprehensive testing and CI/CD - all in weeks.</p>
      </div>
    </section>
  );
};

export default Mission;
