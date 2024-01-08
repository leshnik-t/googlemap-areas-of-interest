import { SingleAOIType } from "../features/loadedAOISlice";
import { EXPLORE_MODE_COLOR, svgMarker } from "./constants";
import { DataType } from "../dataTypes/dataTypes";

const createPolygon = (
    id: string,
    coordinates: google.maps.LatLngLiteral[],
) => {
    try {
        const polygonItem = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: EXPLORE_MODE_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: EXPLORE_MODE_COLOR,
            fillOpacity: 0.35,
        });

        return ({
            id: id,
            coordinates: coordinates,
            instance: polygonItem
        } as DataType)
    } catch(e){
        console.log(e);
        return null;
    }  
}

const createMarker = (
    id: string,
    coordinates: google.maps.LatLngLiteral,
) => {
    try {
        const markerItem = new google.maps.Marker({
            position: coordinates,
            icon : {
                ...svgMarker,
                fillColor: EXPLORE_MODE_COLOR,
                strokeColor: EXPLORE_MODE_COLOR
            }
        });

        return ({
            id: id,
            coordinates: coordinates,
            instance: markerItem
        } as DataType);
    } catch(e) {
        console.log(e);
        return null;
    }
}

export const createGeometryElementInstance = (
    item: SingleAOIType,
) => {
    console.log(item);
    const {id, coordinates, type} = item;

    switch(true) {
        case (type === 'polygon'): {
            const newPolygonDataItem = createPolygon(
                id, 
                coordinates as google.maps.LatLngLiteral[]
            );
            
            return newPolygonDataItem;
        }
        case (type === 'marker'): {
            const newMarkerDataItem = createMarker(
                id, 
                coordinates as google.maps.LatLngLiteral
            );

            return newMarkerDataItem;
        }
        default: return null;
    }
}