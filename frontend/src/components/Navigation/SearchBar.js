import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadAllSpots } from "../../store/spots";

function SearchBar () {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const allSpotsData = useSelector(state => state.spots.allSpots);
  let allSpots;
  if (allSpotsData) allSpots = Object.values(allSpotsData);

  useEffect(() => {
    dispatch(thunkLoadAllSpots())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);

    const results = performSearch(searchTerm);
    setSearchResults(results);
  };

  const performSearch = (searchTerm) => {
    
    if (searchTerm === "") {
      return [];
    }

    const results = allSpots.filter((spot) => {
      return spot.city.toLowerCase().includes(searchTerm.toLowerCase()) 
      || spot.state.toLowerCase().includes(searchTerm.toLowerCase())
      || spot.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return results;
  };

  return (
    <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          className="search-bar-input"
          onChange={handleSearch}
        />
        {searchTerm && 
          <ul className="search-list">
            {searchResults.map((result) => (
              <li key={result.id}>{result.name}</li>
            ))}
          </ul>
        }
    </div>
  )
}

export default SearchBar;
