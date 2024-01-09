export type PolygonType = {
    id: string,
    coordinates: google.maps.LatLngLiteral[],
    instance: google.maps.Polygon,
}

export type MarkerType = {
    id: string,
    coordinates: google.maps.LatLngLiteral,
    instance: google.maps.Polygon,
}

export type DataType = {
    id: string,
    coordinates: google.maps.LatLngLiteral | google.maps.LatLngLiteral[],
    instance: google.maps.Polygon | google.maps.Marker
}

export type ModeType = 'explore' | 'draw' | 'select';

export type GeometryElementType = google.maps.Polygon | google.maps.Marker;