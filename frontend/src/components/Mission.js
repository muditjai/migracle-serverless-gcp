import React from 'react';
import { Activity, Database, Zap } from 'lucide-react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">Our mission</div>
        <h2 className="text-2xl text-white mb-12">Accelerate Innovation Through Seamless Migrations</h2>
        <p>We're on a mission to eliminate the technical debt of platform migrations. By automating migrations using AI, we free organizations to make platform decisions based on business value rather than migration constraints.</p>  
      </div>
    </section>
  );
};

export default Mission;
