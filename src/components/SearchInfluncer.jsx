import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import supabase from '../supabaseClient';
// Correct the path if your modal is in a different folder
import AddNewInfluencerModal from './AddinfluencerModal'; 
import InfluencerCard from './Influncerscard/InfluncerCards';

import { HiMagnifyingGlass, HiPlus, HiUserGroup, HiChevronDown } from 'react-icons/hi2';

// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
};

// Search query validation
const validateSearchQuery = (query) => {
  if (query.length > 100) {
    return 'Search query too long (max 100 characters)';
  }
  return null;
};

// Corrected component name typo: SearchInfluencer
const SearchInfluencer = () => { 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  
  // Infinite scrolling states
  const [displayedInfluencers, setDisplayedInfluencers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 12; // Show 12 influencers per page

  // Enhanced filtering with multiple criteria - using useMemo to prevent infinite loops
  const filteredInfluencers = useMemo(() => {
    return influencers.filter((inf) => {
      // Check if influencer has required fields
      if (!inf.fullname && !inf.username) return false;
      
      const sanitizedQuery = sanitizeInput(searchQuery);
      const searchLower = sanitizedQuery.toLowerCase();
      
      // Search filter
      const matchesSearch = !sanitizedQuery || (
        (inf.fullname && inf.fullname.toLowerCase().includes(searchLower)) ||
        (inf.username && inf.username.toLowerCase().includes(searchLower)) ||
        (inf.bio && inf.bio.toLowerCase().includes(searchLower)) ||
        (inf.platform && inf.platform.toLowerCase().includes(searchLower))
      );
      
      // Platform filter
      const matchesPlatform = selectedPlatform === 'All Platforms' || 
        (inf.platform && inf.platform.toLowerCase() === selectedPlatform.toLowerCase());
      
      // Rating filter
      const matchesRating = selectedRating === 'All Ratings' || 
        (() => {
          if (!inf.avg_overall) return false;
          const rating = parseFloat(inf.avg_overall);
          switch (selectedRating) {
            case '5 Stars': return rating >= 4.5;
            case '4 Stars & up': return rating >= 3.5;
            case '3 Stars & up': return rating >= 2.5;
            default: return true;
          }
        })();
      
      // Tag filter
      const matchesTag = activeTag === 'All' || 
        (inf.tags && inf.tags.some(tag => tag.toLowerCase().includes(activeTag.toLowerCase().replace('#', ''))));
      
      return matchesSearch && matchesPlatform && matchesRating && matchesTag;
    });
  }, [influencers, searchQuery, selectedPlatform, selectedRating, activeTag]);

  // Handle search input with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous search error
    if (searchError) {
      setSearchError(null);
    }
    
    // Validate search query
    const validationError = validateSearchQuery(value);
    if (validationError) {
      setSearchError(validationError);
    }
  };

  // Load more influencers when scrolling
  const loadMoreInfluencers = () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newInfluencers = filteredInfluencers.slice(startIndex, endIndex);
      
      setDisplayedInfluencers(prev => [...prev, ...newInfluencers]);
      setCurrentPage(prev => prev + 1);
      setHasMore(endIndex < filteredInfluencers.length);
      setIsLoadingMore(false);
    }, 500);
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreInfluencers();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMore, isLoadingMore]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayedInfluencers([]);
    setCurrentPage(1);
    setHasMore(true);
    
    // Load initial batch
    const initialInfluencers = filteredInfluencers.slice(0, ITEMS_PER_PAGE);
    setDisplayedInfluencers(initialInfluencers);
    setHasMore(filteredInfluencers.length > ITEMS_PER_PAGE);
  }, [filteredInfluencers.length, searchQuery, selectedPlatform, selectedRating, activeTag]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let { data, error } = await supabase
          .from('influencer')
          .select(`
            *,
            ratings:ratings(overall)
          `);

        if (error) {
          console.error('Database error:', error);
          setError('Failed to load influencers. Please try again.');
        } else {
          // Process ratings data like InfluncerList does
          const influencersWithAvg = (data || []).map((inf) => {
            const ratings = inf.ratings || [];
            const avg_overall =
              ratings.length > 0
                ? ratings.reduce((sum, r) => sum + (r.overall || 0), 0) / ratings.length
                : null;
            return { ...inf, avg_overall };
          });
          setInfluencers(influencersWithAvg);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInfluencers();
  }, []);

  const filterTags = [
    'All', '#Beauty', '#Lifestyle', '#HonestReviews', '#Skincare', 
    '#Food', '#Travel', '#Tech', '#Education', '#Gaming', '#Entertainment', '#Fitness'
  ];

  // Safe tag filtering
  const handleTagClick = (tag) => {
    // Validate tag is in allowed list
    if (filterTags.includes(tag)) {
      setActiveTag(tag);
    }
  };

  // Platform filter handler
  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  // Rating filter handler
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveTag('All');
    setSelectedRating('All Ratings');
    setSelectedPlatform('All Platforms');
    setSearchError(null);
  };

  return (
    <div className="relative w-full font-sans">
      <div className="relative z-10 bg-slate-50/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
        {/* Header section with background */}
        <div className="relative mb-8"> 
        
          <div className="relative z-20">
            <div className="flex flex-col items-center text-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">Discover Influencers</h1>
              <p className="text-slate-500 text-sm sm:text-base lg:text-lg px-4">
                Find authentic creators through community ratings and reviews
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              >
                <HiPlus className="w-5 h-5" />
                Add Influencer
              </button>
              <div className="flex items-center gap-2 text-slate-600">
                <HiUserGroup className="w-5 h-5 text-blue-500" />
                <span className="font-medium">
                  {isLoading ? 'Loading...' : `${filteredInfluencers.length} influencers found`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-5xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Filter Section Card */}
        <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative col-span-1 md:col-span-1">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                value={searchQuery}
                onChange={handleSearchChange}
                type="text" 
                placeholder="Search influencers..." 
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow ${
                  searchError ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'
                }`}
                maxLength={100}
              />
              {searchError && (
                <p className="text-xs text-red-500 mt-1 absolute">{searchError}</p>
              )}
            </div>
            <div className="relative">
              <select 
                value={selectedRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              >
                <option>All Ratings</option>
                <option>5 Stars</option>
                <option>4 Stars & up</option>
                <option>3 Stars & up</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={selectedPlatform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              >
                <option>All Platforms</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>TikTok</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filterTags.map((tag) => (
              <button 
                key={tag} 
                onClick={() => handleTagClick(tag)} 
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                  activeTag === tag ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* Active Filters Display */}
          {(searchQuery || activeTag !== 'All' || selectedRating !== 'All Ratings' || selectedPlatform !== 'All Platforms') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {activeTag !== 'All' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Tag: {activeTag}
                </span>
              )}
              {selectedRating !== 'All Ratings' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  Rating: {selectedRating}
                </span>
              )}
              {selectedPlatform !== 'All Platforms' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Platform: {selectedPlatform}
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="max-w-5xl mx-auto mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading influencers...</p>
          </div>
        )}

        {/* Search Results Info */}
        {!isLoading && (searchQuery || activeTag !== 'All' || selectedRating !== 'All Ratings' || selectedPlatform !== 'All Platforms') && (
          <div className="max-w-5xl mx-auto mt-4 text-center">
            <p className="text-slate-600">
              Showing {displayedInfluencers.length} of {filteredInfluencers.length} influencer{filteredInfluencers.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {hasMore && displayedInfluencers.length > 0 && (
                <span className="text-blue-600"> • Scroll to load more</span>
              )}
            </p>
          </div>
        )}

        {/* Display Filtered Results */}
        {!isLoading && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {displayedInfluencers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {displayedInfluencers.map((influencer) => (
                  <InfluencerCard key={influencer.id} influencer={influencer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-slate-500 text-base sm:text-lg">
                  {searchQuery ? `No influencers found for "${searchQuery}"` : 'No influencers available'}
                </p>
              </div>
            )}
            
            {/* Load More Indicator */}
            {isLoadingMore && (
              <div className="text-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-slate-600 text-sm">Loading more influencers...</p>
              </div>
            )}
            
            {/* End of Results */}
            {!hasMore && displayedInfluencers.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-slate-500 text-sm">You've reached the end of the results</p>
              </div>
            )}
          </div>
        )}
        
        {/* Add Influencer Modal */}
        <AddNewInfluencerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  )
}

export default SearchInfluencer;