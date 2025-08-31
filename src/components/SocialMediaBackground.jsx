import React from 'react';

const SocialMediaBackground = () => {
  const socialIcons = [
    { name: 'instagram', icon: '📷', color: 'from-pink-500 to-purple-500' },
    { name: 'youtube', icon: '📺', color: 'from-red-500 to-red-600' },
    { name: 'tiktok', icon: '🎵', color: 'from-black to-gray-800' },
    { name: 'twitter', icon: '🐦', color: 'from-blue-400 to-blue-500' },
    { name: 'facebook', icon: '📘', color: 'from-blue-600 to-blue-700' },
    { name: 'snapchat', icon: '👻', color: 'from-yellow-400 to-yellow-500' },
    { name: 'linkedin', icon: '💼', color: 'from-blue-700 to-blue-800' },
    { name: 'twitch', icon: '🎮', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-pulse"></div>
      
      {/* Floating social media icons */}
      {socialIcons.map((social, index) => (
        <div
          key={social.name}
          className={`absolute text-4xl md:text-6xl opacity-10 animate-float-${index + 1}`}
          style={{
            left: `${10 + (index * 12) % 80}%`,
            top: `${20 + (index * 15) % 60}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${8 + index}s`,
          }}
        >
          <div className={`bg-gradient-to-r ${social.color} bg-clip-text text-transparent`}>
            {social.icon}
          </div>
        </div>
      ))}
      
      {/* Additional floating elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-200 to-red-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[length:20px_20px]"></div>
    </div>
  );
};

export default SocialMediaBackground;
