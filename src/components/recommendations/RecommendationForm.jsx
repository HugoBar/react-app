import React, { useState, useEffect } from "react";
import { createUserRecommendation } from "../../utils/recommendationRequests";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import { trackSearch } from "../../utils/trackRequests";
import placeholder from "../../assets/track-placeholder.png";

function RecommendationForm({ groupId, onNewRecommendation }) {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (spotifyId) => {
    try {
      await createUserRecommendation(groupId, spotifyId);
      onNewRecommendation();
    } catch (error) {
      console.error("Error creating recommendation:", error);
    }
  };

  const fetchSearchResults = async () => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await trackSearch(keyword);
      setSearchResults(response || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  return (
    <Autocomplete
      freeSolo
      loading={loading}
      options={searchResults}
      getOptionLabel={(option) => option.name || ""} // Label for selected value
      filterOptions={(x) => x} // Disable filtering
      onInputChange={(event, newValue) => setKeyword(newValue)}
      renderOption={(props, option) => {
        const coverUrl = option.cover?.[0]?.url || placeholder;

        const handleClick = () => {
          handleSubmit(option.id);
        };

        return (
          <li
            {...props}
            key={option.id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
            onClick={handleClick}
          >
            <img
              src={coverUrl}
              alt={option.name}
              style={{ width: 40, height: 40, borderRadius: 4 }}
            />
            <div>
              <Typography variant="body1">{option.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {option.artists?.join(", ") || "Unknown Artist"}
              </Typography>
            </div>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search Track" variant="outlined" />
      )}
      sx={{ width: "80%", padding: "15px", marginTop: 4 }}
    />
  );
}

export default RecommendationForm;
