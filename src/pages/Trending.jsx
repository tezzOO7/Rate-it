import React, { useState, useEffect } from "react";
import Navbar from "../components/header/Navbar";
import supabase from "../supabaseClient";
import InfluencerCard from "../components/Influncerscard/InfluncerCards";

const Trending = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const { data, error } = await supabase
          .from("influencer")
          .select("*")
          .order("followers", { ascending: false });

        if (error) {
          throw error;
        }

        setInfluencers(data);
      } catch (error) {
        console.error("Error fetching influencers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Trending Influencers
        </h1>
        {loading ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {influencers.map((influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
