import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { Link } from "react-router-dom";
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_name, avatar_url, user_email")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        }
        if (data) {
          setProfile(data);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
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
        // Enhanced error messages for mobile
        let errorMessage = error.message;
        if (error.message.includes('fetch')) {
          errorMessage = 'Connection error. Please check your internet connection and try again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Browser security error. Please try using a different browser or clear your cache.';
        }
        setAuthError(errorMessage);
      } else {
        setMenuOpen(false);
        setShowAuth(false);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setAuthError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo: 'https://tezzoo7.github.io/Rate-it/'
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

  const displayName = profile?.user_name || user?.email;

  return (
    <nav className="bg-white border shadow border-gray-300 text-black px-6 py-4">
      {/* Container to center content */}
      <div className="max-w-6xl mx-auto flex justify-between items-center relative">
        <h1 className="text-2xl font-bold text-blue-500">⚝ Rate it</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5">
          <Link to={"/"} className="hover:text-blue-400">
            Discover
          </Link>
          📈<Link
            to={"/Trending"}
            className="
    flex items-center space-x-2
    font-semibold
    bg-gradient-to-r from-sky-500 to-indigo-500
    text-transparent bg-clip-text
    hover:from-sky-400 hover:to-indigo-400
    transition-colors duration-300
  "
          >
         
            <span>Trending</span>
          </Link>

          {user ? (
            <>
              <span className="font-semibold">Welcome, {displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login / Signup
            </button>
          )}
        </div>

        {/* Hamburger for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none z-20"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white flex flex-col items-center space-y-4 py-6 md:hidden z-10">
           <Link to={"/"} className="hover:text-blue-400">
            Discover
          </Link>
          📈<Link
            to={"/Trending"}
            className="
    flex items-center space-x-2
    font-semibold
    bg-gradient-to-r from-sky-500 to-indigo-500
    text-transparent bg-clip-text
    hover:from-sky-400 hover:to-indigo-400
    transition-colors duration-300
  "
          >
         
            <span>Trending</span>
          </Link>
          <div className="border-t border-gray-400 w-1/2 my-2"></div>
          {user ? (
            <>
              <span className="font-semibold text-lg">
                Welcome, {displayName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setShowAuth(true);
                setMenuOpen(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded  hover:bg-blue-600"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}

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
                  Don’t have an account?{" "}
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
    </nav>
  );
}
