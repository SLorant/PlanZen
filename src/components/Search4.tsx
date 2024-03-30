import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { SearchBox } from "@mapbox/search-js-react";

const ACCESS_TOKEN = "pk.eyJ1IjoieHJhbm8iLCJhIjoiY2x1Y2htdmxjMTV0YTJocXVxenE5OTh0MyJ9.vcTu5yRxmUjzfb1mmCXF7w";

const Search4 = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.99209, 40.68933],
      zoom: 8.8,
    });
    mapRef.current = map;

    const marker = new mapboxgl.Marker();
    markerRef.current = marker;

    return () => map.remove();
  }, []);

  const handleSelect = (result) => {
    console.log("Chosen Address:", result.features[0].properties.name);
    const coordinates = result.features[0].geometry.coordinates;
    mapRef.current.flyTo({ center: coordinates });
    console.log(result.features[0]);
    console.log(coordinates);
    // Update marker position
    markerRef.current.setLngLat(coordinates).addTo(mapRef.current);
  };

  return (
    <div>
      <SearchBox
        marker={true}
        mapboxgl={mapboxgl}
        accessToken={ACCESS_TOKEN}
        onRetrieve={handleSelect}
        map={mapRef.current}
      />
      <div ref={mapContainerRef} style={{ position: "absolute", width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Search4;
