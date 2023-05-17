import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

function SearchBar () {
  const dispatch = useDispatch();

  return (
    <div className="search-bar">
      <form>
        <input
          type="text"
          placeholder="Search"
        />
        <button type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  )
}

export default SearchBar;
