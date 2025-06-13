import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const Hero = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the API endpoint from window configuration
      const apiUrl = `${window.API_ENDPOINT}/subscribeHandler`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for subscribing!');
        setEmail('');
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hero font-['Inter']" aria-label="Introduction">
      <div className="container">
        <h1>Transform complex migrations into automated one-click workflows</h1>
        <p>Migracle's AI agents handle the heavy lifting - from data to dashboards, from APIs to alerts - reducing migration timelines by 80% while maintaining perfect fidelity.</p>

        <div className="input-form-container">
          <form id="subscriptionForm" className="input-form" onSubmit={handleSubscribe}>
            <div className="input-wrapper">
              <Mail className="email-icon w-5 h-5" />
              <input
                type="email"
                id="subscribeEmail"
                placeholder="Your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit" 
              className="subscribe-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Updates'}
            </button>
          </form>
        </div>

        <div className="arc-container">
          <img src="./assets/arc-crop.png" alt="Arc decoration" className="arc-image" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
