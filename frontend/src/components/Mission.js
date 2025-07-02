import React from 'react';
import { Activity, Database, Zap } from 'lucide-react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">Our mission</div>
        <h2 className="text-2xl text-white mb-12">Simplify Observability Platform Transitions</h2>
        <p>Using AI to speed up migration timelines and reduce observability costs. Automate Datadog conversions to Grafana, New Relic, Chronosphere and others without barriers.</p>  
      </div>
    </section>
  );
};

export default Mission;
