import React from 'react';
import Navbar from '../components/header/Navbar';
import Footer from '../components/footer/Footer';
import { Shield, Star, Users } from 'lucide-react';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="py-20 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Authentic Reviews for a Modern World
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Rate-it is a community-driven platform dedicated to providing honest and transparent reviews of influencers.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="feature-item">
                <Shield size={48} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-2xl font-bold mb-2">Trustworthy</h3>
                <p className="text-gray-600">
                  We are committed to providing a platform free of censorship and biased opinions.
                </p>
              </div>
              <div className="feature-item">
                <Star size={48} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-2xl font-bold mb-2">Honest Feedback</h3>
                <p className="text-gray-600">
                  Share your genuine experiences and help others make informed decisions.
                </p>
              </div>
              <div className="feature-item">
                <Users size={48} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-2xl font-bold mb-2">Community-Powered</h3>
                <p className="text-gray-600">
                  Our platform is built by and for the community of users who value authenticity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join the Conversation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Become a part of our growing community and start sharing your voice today.
            </p>
            <a
              href="/#/"
              className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;