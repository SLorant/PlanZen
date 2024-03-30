import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

const ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";

const Map = () => {
  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.99209, 40.68933],
      zoom: 8.8,
    });

    const searchBox = new mapboxgl.mapb({
      accessToken: ACCESS_TOKEN,
      types: "address,poi",
      proximity: [-73.99209, 40.68933],
      marker: true,
      mapboxgl: mapboxgl,
    });

    map.addControl(searchBox);

    searchBox.on("result", function (result) {
      console.log("Chosen Address:", result.result.text);
      // You can use result.result.text or other properties of the result object as needed
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ position: "absolute", width: "100%", height: "100%" }}></div>;
};

export default Map;
