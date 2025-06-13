import React from 'react';

const Footer = () => {
  return (
    <footer className="footer font-['Inter']">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Migracle. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
