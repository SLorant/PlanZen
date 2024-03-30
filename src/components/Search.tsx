import { SearchBox } from "@mapbox/search-js-react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import Map from "react-mapbox-gl";
import * as mapboxgl from "react-mapbox-gl";

export function Component() {
  //mapboxgl.accessToken = ACCESS_TOKEN;

  /*  Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(
    "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
  );
 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /*  (mapboxgl as any).mapboxAccessToken =
    "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A";
 */
  const map = new Map({
    container: "mapId",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-73.99209, 40.68933],
    zoom: 8.8,
    accessToken: "pk.eyJ1IjoieHJhbm8iLCJhIjoiY2x1Y2htdmxjMTV0YTJocXVxenE5OTh0MyJ9.vcTu5yRxmUjzfb1mmCXF7w",
  });

  // const [value, setValue] = React.useState('');
  /*  const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A",
  }); */
  return (
    <form>
      <SearchBox
        marker={true}
        accessToken={"pk.eyJ1IjoieHJhbm8iLCJhIjoiY2x1Y2htdmxjMTV0YTJocXVxenE5OTh0MyJ9.vcTu5yRxmUjzfb1mmCXF7w"}
      />
      <div id="mapId"></div>
      {/*   <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
      ; */}
    </form>
  );
}
