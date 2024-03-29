import { coordinateFuncsToCoordinates } from './coordinateFuncsToCoordinates';
import { DRAW_MODE_COLOR, svgMarker } from './constants';

const POLYGON_NODES_MIN_QUANTITY = 3;


const processPolygon = (
    overlay: google.maps.Polygon
) => {
    try {
        const coordinateFuncs: google.maps.LatLng[] = overlay
            .getPath()
            .getArray();

        const coordinates =
            coordinateFuncsToCoordinates(coordinateFuncs);

        if (coordinates.length < POLYGON_NODES_MIN_QUANTITY) {
            return null;
        }

        const polygonItem = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: DRAW_MODE_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: DRAW_MODE_COLOR,
            fillOpacity: 0.35,
        });

        return { geometryElement:polygonItem, coordinates };
    } catch(e) {
        console.log(e);
    }
}

const processMarker = (
    overlay: google.maps.Marker
) => {
    try {
        const position = overlay.getPosition();

        if (!position) return null;

        const coordinates = {
            lat: position.lat(),
            lng: position.lng(),
        };

        if (!coordinates) return null;

        const markerItem = new google.maps.Marker({
            position: coordinates,
            icon : {
                ...svgMarker,
                fillColor: DRAW_MODE_COLOR,
                strokeColor: DRAW_MODE_COLOR
            }
        });

        return { geometryElement: markerItem, coordinates};
    } catch(e) {
        console.log(e);
    }
}

export const prepareDataItem = (
    event: google.maps.drawing.OverlayCompleteEvent
    ) => {
    const { type, overlay } = event;

    switch(true) {
        case (type === google.maps.drawing.OverlayType.POLYGON): {
            const processedPolygon = processPolygon(overlay as google.maps.Polygon);

            return processedPolygon;
        }
        case (type === google.maps.drawing.OverlayType.MARKER) : {
            const processedMarker = processMarker(overlay as google.maps.Marker);

            return processedMarker;
        }
        default: return null;
    }
}