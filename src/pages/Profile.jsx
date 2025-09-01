import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../supabaseClient";
import Navbar from "../components/header/Navbar";
import ReviewModal from "../components/ReviewModal/ReviewModal";


const Profile = () => {
  const { id } = useParams();
  


  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averages, setAverages] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Auth modal states
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState(null);

  const averageOverall =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.overall || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  const socialIcons = {
    youtube:
      "https://img.icons8.com/?size=100&id=19318&format=png&color=000000",
    tiktok:
      "https://img.icons8.com/?size=100&id=118640&format=png&color=000000",
    instagram:
      "https://img.icons8.com/?size=100&id=32323&format=png&color=000000",
  };

  // ✅ Fetch influencer
  const fetchInfluencer = async () => {
    const { data, error } = await supabase
      .from("influencer")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching influencer:", error.message);
    } else {
      setInfluencer(data);
    }
    setLoading(false);
  };

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("ratings")
      .select(
        `
        id,
        content,
        overall,
        authenticity,
        professionalism,
        communication,
        created_at,
        user:profiles!ratings_user_id_comment_fkey(user_name, avatar_url)
      `
      )
      .eq("influencer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data);
    }

    // ✅ fetch averages
    const { data: avgData, error: avgError } = await supabase.rpc(
      "get_influencer_averages",
      { influencer: id }
    );

    if (avgError) {
      console.error("Error fetching averages:", avgError);
    } else {
      setAverages(avgData[0]);
    }
  };

  // ✅ Track logged in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Auth handling functions
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);

    let error = null;

    if (authMode === "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      error = loginError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
          },
        },
      });
      error = signUpError;
    }

    if (error) {
      setAuthError(error.message);
    } else {
      setShowAuth(false);
      setForm({ name: "", email: "", password: "" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Dynamic redirect URL that works in both development and production
      const redirectUrl = window.location.origin + window.location.pathname;
      
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        setAuthError('Google login failed. Please try again.');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setAuthError('Google login error. Please try again.');
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError(null);
  };

  useEffect(() => {
   
    if (id) {
      fetchInfluencer();
      fetchReviews();
    }
  }, [id]);

  // ✅ Submit new review
  const handleReviewSubmit = async (review) => {
    if (!currentUser) {
      alert("You must be signed in to submit a review.");
      return;
    }

    const { data, error } = await supabase
      .from("ratings")
      .insert([
        {
          influencer_id: id,
          authenticity: review.authenticity,
          professionalism: review.professionalism,
          communication: review.communication,
          overall: review.overall,
          content: review.content,
          user_id_comment: currentUser.id,
          created_at: new Date(),
        },
      ])
      .select(
        `
        id,
        content,
        overall,
        created_at,
        user:profiles!ratings_user_id_comment_fkey(user_name, avatar_url)
      `
      );

    if (error) {
      console.error("Error submitting review:", error);
    } else {
      setReviews([data[0], ...reviews]);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!influencer)
    return <div className="text-center py-10">Influencer not found</div>;

  return (
    <>
      
      <div className="relative z-10">
        <Navbar />
        <div className="bg-gray-50/80 backdrop-blur-sm min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back Button */}
          <Link
            to="/"
            className="text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:text-white hover:bg-blue-600 mb-4 inline-block"
          >
            ← Back to Discover
          </Link>

          {/* Banner */}
          <div className="relative w-full h-56 md:h-72 lg:h-80 rounded-lg overflow-hidden bg-gray-200">
            {influencer.bannerPic && (
              <img
                src={influencer.bannerPic}
                alt="banner"
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute left-6 bottom-0 -translate-y-[20%]">
              <img
                src={influencer.profilePic || "/default-avatar.jpg"}
                alt={influencer.fullname}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-lg object-cover bg-gray-100"
              />
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex items-center justify-between mt-6 ml-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {influencer.fullname}
                {influencer.verified && (
                  <span className="text-blue-500">✔</span>
                )}
              </h1>
              <p className="text-gray-600">@{influencer.username}</p>
            </div>

            <div className="flex items-center gap-3">
              {influencer.platform && socialIcons[influencer.platform] && (
                <img
                  src={socialIcons[influencer.platform]}
                  alt={influencer.platform}
                  className="w-6 h-6"
                />
              )}
              <p className="text-sm text-gray-500">
                {influencer.followers || 0} followers
              </p>
            </div>
          </div>

          {/* About + Rating */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">
                {influencer.bio || "No bio available."}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(influencer.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h2 className="text-lg font-semibold">Overall Rating</h2>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {averageOverall || "N/A"}
              </div>
              <p className="text-sm text-gray-500">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>

          {/* Community Reviews + Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Community Reviews ({reviews.length})
              </h2>

              {/* ✅ Button or Login Message */}
              {currentUser ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
                >
                  Write a Review
                </button>
              ) : (
                <p className="text-sm text-red-500 mb-4">
                  Please{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setShowAuth(true)}
                  >
                    log in
                  </span>{" "}
                  to add a rating.
                </p>
              )}

              <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleReviewSubmit}
              />

              {/* Reviews List */}
              <div className="mt-6 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b pb-3">
                    <p className="font-semibold">
                      {r.user?.user_name || "Anonymous"}
                    </p>
                    <p className="text-gray-600 text-sm">{r.content}</p>
                    <p className="text-yellow-500 text-sm">
                      ⭐ {r.overall?.toFixed(1)}
                    </p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span>Authenticity</span>
                  <span className="text-green-600 font-bold">
                    {averages?.avg_authenticity?.toFixed(1) || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Professionalism</span>
                  <span className="text-green-600 font-bold">
                    {averages?.avg_professionalism?.toFixed(1) || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Communication</span>
                  <span className="text-green-600 font-bold">
                    {averages?.avg_communication?.toFixed(1) || "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-30 p-4">
          <form
            onSubmit={handleAuth}
            className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md relative space-y-4"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-center capitalize">
              {authMode === "login" ? "Login" : "Sign Up"}
            </h2>
            <p className="text-center text-gray-500 text-sm">
              {authMode === "login"
                ? "Welcome back! Please login to your account."
                : "Create a new account to get started."}
            </p>

            {/* Form Inputs */}
            <div className="space-y-3">
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Error Message */}
            {authError && (
              <p className="text-red-500 text-sm text-center">{authError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>

            {/* Divider */}
            <div className="flex items-center text-gray-400 text-sm my-2">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-2">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full text-white py-3 rounded-lg 
                   bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 
                   hover:brightness-110 transition duration-200 font-semibold"
            >
              Continue with Google
            </button>

            {/* Switch Auth Mode */}
            <p className="text-sm text-center text-gray-500 mt-3">
              {authMode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span
                    onClick={() => switchAuthMode("signup")}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => switchAuthMode("login")}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;
