import React, { useState, useEffect } from 'react';
import  supabase  from '../supabaseClient'; // make sure you import your client

// Input validation and sanitization functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
};

const validateInput = (input, fieldName, maxLength = 100) => {
  if (!input || input.trim().length === 0) {
    return `${fieldName} is required`;
  }
  if (input.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
};

const validateUrl = (url) => {
  if (!url) return null; // Optional field
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

const AddNewInfluencerModal = ({ isOpen, onClose }) => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('');
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [bannerPic, setBannerPic] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when inputs change
  const handleInputChange = (setter, fieldName, value) => {
    setter(value);
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    const fullnameError = validateInput(fullname, 'Full Name', 50);
    if (fullnameError) newErrors.fullname = fullnameError;
    
    const usernameError = validateInput(username, 'Username', 30);
    if (usernameError) newErrors.username = usernameError;
    
    if (!platform) newErrors.platform = 'Platform is required';
    
    // Optional field validations
    const bioError = validateInput(bio, 'Bio', 500);
    if (bioError) newErrors.bio = bioError;
    
    const profileUrlError = validateUrl(profilePic);
    if (profileUrlError) newErrors.profilePic = profileUrlError;
    
    const bannerUrlError = validateUrl(bannerPic);
    if (bannerUrlError) newErrors.bannerPic = bannerUrlError;
    
    // Followers validation
    if (followers !== null && followers < 0) {
      newErrors.followers = 'Follower count cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // insert function
  const Addinfluncers = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to add an influencer.");
        return;
      }

      // Sanitize all inputs before sending to database
      const sanitizedData = {
        fullname: sanitizeInput(fullname),
        username: sanitizeInput(username),
        platform: sanitizeInput(platform),
        bio: sanitizeInput(bio),
        followers: followers ? parseInt(followers) : 0,
        profilePic: sanitizeInput(profilePic),
        bannerPic: sanitizeInput(bannerPic),
        tags: tags.map(tag => sanitizeInput(tag)),
        user_id: user.id,
      };

      const { error } = await supabase.from('influencer').insert([sanitizedData]);

      if (error) {
        alert(error.message);
      } else {
        alert('Influencer added successfully');

        // reset form
        setFullname('');
        setUsername('');
        setPlatform('');
        setBio('');
        setFollowers(0);
        setProfilePic('');
        setBannerPic('');
        setTags([]);
        setErrors({});
        onClose();
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error adding influencer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
        >
          ← Back to Discover
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Add New Influencer</h2>
          <p className="text-slate-500">Help the community discover new authentic creators</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            Addinfluncers();
          }}
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              id="fullName"
              value={fullname}
              onChange={(e) => handleInputChange(setFullname, 'fullname', e.target.value)}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
            {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              placeholder="@username"
              id="username"
              value={username}
              onChange={(e) => handleInputChange(setUsername, 'username', e.target.value)}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              placeholder="Describe your influencer"
              id="bio"
              rows="3"
              value={bio}
              onChange={(e) => handleInputChange(setBio, 'bio', e.target.value)}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            ></textarea>
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
          </div>

          {/* Platform + Followers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-slate-700 mb-1">
                Platform *
              </label>
              <select
                name="platform"
                id="platform"
                value={platform}
                onChange={(e) => handleInputChange(setPlatform, 'platform', e.target.value)}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              >
                <option value="">Select platform</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
              {errors.platform && <p className="text-xs text-red-500 mt-1">{errors.platform}</p>}
            </div>
            <div>
              <label
                htmlFor="followerCount"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Follower Count
              </label>
              <input
                type="number"
                min="0"
                placeholder="0 M"
                name="followerCount"
                id="followerCount"
                value={followers}
                onChange={(e) => handleInputChange(setFollowers, 'followers', e.target.value)}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
              {errors.followers && <p className="text-xs text-red-500 mt-1">{errors.followers}</p>}
            </div>
          </div>

          {/* Profile Pic */}
          <div>
            <label
              htmlFor="profilePicUrl"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Profile Picture URL
            </label>
            <input
              type="text"
              placeholder="https://url-picture.com"
              name="profilePicUrl"
              id="profilePicUrl"
              value={profilePic}
              onChange={(e) => handleInputChange(setProfilePic, 'profilePic', e.target.value)}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
            {errors.profilePic && <p className="text-xs text-red-500 mt-1">{errors.profilePic}</p>}
          </div>

          {/* Banner Pic */}
          <div>
            <label
              htmlFor="bannerImageUrl"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Banner Image URL
            </label>
            <input
              type="text"
              placeholder="https://url-banner.com"
              name="bannerImageUrl"
              id="bannerImageUrl"
              value={bannerPic}
              onChange={(e) => handleInputChange(setBannerPic, 'bannerPic', e.target.value)}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
            {errors.bannerPic && <p className="text-xs text-red-500 mt-1">{errors.bannerPic}</p>}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
              Tags
            </label>
            <select
              name="tags"
              id="tags"
              multiple
              value={tags}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setTags(selected);
              }}
              className="border-slate-300 w-full rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            >
              <option value="entertainment">Entertainment</option>
              <option value="music">Music</option>
              <option value="gaming">Gaming</option>
              <option value="fashion">Fashion</option>
              <option value="travel">Travel</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Influencer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewInfluencerModal;
