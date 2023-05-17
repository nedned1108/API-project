import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadAllSpots } from "../../store/spots";

function SearchBar () {
  const dispatch = useDispatch();
  const allSpotsData = useSelector(state => state.spots.allSpots);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    dispatch(thunkLoadAllSpots())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);

    const results = performSearch(searchTerm);
    setSearchResults(results);
  };

  const performSearch = (e) => {
    e.preventDefault();
    dispatch(searchTerm);
  };

  return (
    <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          className="search-bar-input"
          onChange={handleSearch}
        />
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
    </div>
  )
}

export default SearchBar;
