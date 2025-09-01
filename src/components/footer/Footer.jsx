import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Rate-it. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
