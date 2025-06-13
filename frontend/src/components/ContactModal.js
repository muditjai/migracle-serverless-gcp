import React, { useState, useEffect } from 'react';
import { Mail, X, Send, ArrowRight } from 'lucide-react';

const ContactModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const modal = document.getElementById('contactModal');
    if (modal) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style') {
            setIsOpen(modal.style.display === 'block');
          }
        });
      });
      
      observer.observe(modal, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the API endpoint from window configuration
      const apiUrl = `${window.API_ENDPOINT}/contactHandler`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for your message!');
        setFormState({ name: '', email: '', message: '' });
        setIsOpen(false);
        const modal = document.getElementById('contactModal');
        if (modal) modal.style.display = 'none';
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Error sending message: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    const modal = document.getElementById('contactModal');
    if (modal) modal.style.display = 'none';
  };

  return (
    <div 
      id="contactModal"
      className={`fixed inset-0 z-50 min-h-screen w-full grid place-items-center p-4
        transition-all duration-300 font-['Inter'] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-[#181818] rounded-2xl w-full max-w-lg p-8 border border-white/10
          transform transition-all duration-300 mx-auto
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Get in touch</h2>
        <p className="text-white/70 mb-6">Fill out the form or send us an email directly.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="group">
              <input
                type="text"
                placeholder="Your name"
                value={formState.name}
                onChange={e => setFormState({...formState, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                  placeholder:text-white/30 focus:border-white/30 focus:ring-0 transition-colors
                  group-hover:border-white/20"
                required
              />
            </div>

            <div className="group">
              <input
                type="email"
                placeholder="Your email"
                value={formState.email}
                onChange={e => setFormState({...formState, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                  placeholder:text-white/30 focus:border-white/30 focus:ring-0 transition-colors
                  group-hover:border-white/20"
                required
              />
            </div>

            <div className="group">
              <textarea
                placeholder="Your message"
                value={formState.message}
                onChange={e => setFormState({...formState, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                  placeholder:text-white/30 focus:border-white/30 focus:ring-0 transition-colors
                  group-hover:border-white/20 h-32 resize-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg
              hover:bg-white/90 transition-colors relative group overflow-hidden"
          >
            <span className={`flex items-center justify-center gap-2 transition-transform duration-300
              ${isSubmitting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
              Submit <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300
              ${isSubmitting ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              Sending...
            </span>
          </button>
        </form>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Us
          </h3>
          <p className="text-white/70 text-sm mb-3">
            Email us your queries and we'll get back to you ASAP.
          </p>
          <a 
            href="mailto:mudit@migracle.com"
            className="text-white font-medium hover:text-white/80 transition-colors inline-flex items-center gap-2"
          >
            mudit@migracle.com
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
