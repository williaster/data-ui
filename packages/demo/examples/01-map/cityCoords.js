export const SF = {
  latitude: 37.805,
  longitude: -122.447,
  zoom: 12,
};

export const LA = {
  latitude: 34.021,
  longitude: -118.692,
};

export const TOKYO = {
  latitude: 35.674,
  longitude: 139.570,
};

// from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
export function latLngZoomToTile({ lat, lng, zoom }) {
  const n = 2 ** zoom;
  const latRadians = (lat * Math.PI) / 180;
  return {
    x: Math.floor(
      n * ((lng + 180) / 360),
    ),
    y: Math.floor(
      n * ((1 - (Math.log(Math.tan(latRadians) + (1 / Math.cos(latRadians))) / Math.PI)) / 2),
    ),
    z: zoom,
  };
}
