import React, { useEffect, useState } from "react";
import  supabase  from "../../supabaseClient";
import InfluencerCard from "./InfluncerCards";

const InfluencerList = () => {
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const { data, error } = await supabase.from("influencer").select(`
        *,
        ratings:ratings(overall)
      `);
      if (error) {
        console.error("Error fetching influencers:", error.message);
      } else {
        setInfluencers(data);
      }

      const influencersWithAvg = data.map((inf) => {
  const ratings = inf.ratings || [];
  const avg_overall =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.overall || 0), 0) / ratings.length
      : null;
  return { ...inf, avg_overall };
});

      setInfluencers(influencersWithAvg);
    };

    fetchInfluencers();
  }, []);

  return (
   <div className="max-w-6xl mx-auto px-6 py-10">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {influencers.map((influencer) => (
      <InfluencerCard key={influencer.id} influencer={influencer} />
    ))}
  </div>
</div>

  );
};

export default InfluencerList;
