import React from "react";
import { Link } from "react-router-dom";

// Input sanitization function to prevent XSS
const sanitizeDisplayText = (text) => {
  if (typeof text !== 'string') return text || '';
  // Remove HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
};

const InfluencerCard = ({ influencer }) => {
  const socialIcons = {
    youtube:
      "https://img.icons8.com/?size=100&id=19318&format=png&color=000000",
    tiktok: "https://img.icons8.com/?size=100&id=118640&format=png&color=000000",
    instagram:
      "https://img.icons8.com/?size=100&id=32323&format=png&color=000000",
  };

  // Sanitize user inputs before display
  const safeFullname = sanitizeDisplayText(influencer.fullname);
  const safeBio = sanitizeDisplayText(influencer.bio);
  const safePlatform = sanitizeDisplayText(influencer.platform);

  return (
    <div className="bg-white relative hover:scale-105 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-transform duration-300 w-full max-w-sm mx-auto before:content-[''] before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-0 hover:before:opacity-40 before:blur-lg before:-z-10">
      {/* Banner */}
      <div className="h-32 sm:h-40 bg-gray-200 relative">
        <img
          src={influencer.bannerPic || "https://via.placeholder.com/400x160"}
          alt="Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x160";
          }}
        />
        <img
          src={influencer.profilePic || "https://via.placeholder.com/100"}
          alt={safeFullname || "Influencer"}
          className="w-16 h-16 rounded-3xl object-cover border-3 border-white absolute -bottom-8 left-1/6 transform -translate-x-1/2 -translate-y-1/2"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/100";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 text-left mt-6 sm:mt-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
          <h3 className="font-semibold text-base sm:text-lg text-slate-800 leading-tight">
            {safeFullname || "Unknown"}
          </h3>
          
          {socialIcons[safePlatform] && (
            <div className="flex items-center space-x-2">
              <img
                src={socialIcons[safePlatform]}
                alt={safePlatform}
                className="w-4 h-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-gray-600 text-xs sm:text-sm capitalize">
                {safePlatform}
              </span>
            </div>
          )}
        </div>

        {/* Bio (2 lines max) */}
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-4 sm:mb-7 mt-2 sm:mt-6 leading-relaxed">
          {safeBio || "No bio available"}
        </p>

        {/* Rating + Followers */}
        <div className="mt-3 text-xs sm:text-sm text-gray-700 relative">
          {/* Gradient border top */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          {/* Flex row: left + right */}
          <div className="flex justify-between items-center pt-2">
            <span className="flex items-center gap-1">
              <span>⭐</span>
              <span className="font-medium">
                {influencer.avg_overall ? influencer.avg_overall.toFixed(2) : "N/A"}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span>👥</span>
              <span className="font-medium">
                {influencer.followers ? (influencer.followers >= 1000000 
                  ? `${(influencer.followers / 1000000).toFixed(1)}M`
                  : influencer.followers >= 1000 
                  ? `${(influencer.followers / 1000).toFixed(1)}K`
                  : influencer.followers
                ) : 0}
              </span>
            </span>
          </div>
        </div>

        {/* Button with gradient */}
        <Link to={`/Profile/${influencer.id}`} className="block mt-4">
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:opacity-90 transition text-sm sm:text-base font-medium">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default InfluencerCard;
