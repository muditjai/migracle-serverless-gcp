import React from 'react';
import { Activity, Database, Zap } from 'lucide-react';

const Mission = () => {
  return (
    <section className="mission font-['Inter']" aria-label="Our Mission">
      <div className="container">
        <div className="mission-label">Our mission</div>
        <h2 className="text-2xl text-white mb-12">Simplify Observability Platform Transitions</h2>
        <p>We're on a mission to eliminate the complexity of observability migrations. By automating dashboard conversion and metric translation from Datadog to modern platforms like Grafana, Coralogix, and Chronosphere, we empower teams to choose the best observability tools without migration barriers.</p>  
      </div>
    </section>
  );
};

export default Mission;
