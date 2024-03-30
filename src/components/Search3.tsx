import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

const Search3 = () => {
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoieHJhbm8iLCJhIjoiY2x1Y2htdmxjMTV0YTJocXVxenE5OTh0MyJ9.vcTu5yRxmUjzfb1mmCXF7w";
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v9", // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    // Clean up
    return () => map.remove();
  }, []);

  return <div id="map" style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }} />;
};

export default Search3;

result.features[0].properties.name;
