export type PolygonType = {
    id: string,
    coordinates: google.maps.LatLngLiteral[],
    instance: google.maps.Polygon,
}

export type MarkerType = {
    id: string,
    coordinates: google.maps.LatLng,
    instance: google.maps.Polygon,
}

export type DataType = {
    id: string,
    coordinates: google.maps.LatLng | google.maps.LatLngLiteral[],
    instance: google.maps.Polygon | google.maps.Marker
}

export type GeometryElementType = google.maps.Polygon | google.maps.Marker;