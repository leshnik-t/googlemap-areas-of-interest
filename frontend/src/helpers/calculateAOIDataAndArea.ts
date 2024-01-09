import { DataType } from '../dataTypes/dataTypes';
import { SingleAOIType } from '../features/loadedAOISlice';

export const calculateAOIDataAndArea = (
    currentData: DataType[]
  ) => {
    const geometryElementsLatLngArray: google.maps.LatLngLiteral[] = [];

    const currentAOI = currentData.map((dataItem) => {
      dataItem.instance.setMap(null);

     
      let currentInstanceType;
      switch(true) {
        case (dataItem.instance instanceof google.maps.Polygon): {
          const polygonCoordinates = dataItem.coordinates as google.maps.LatLngLiteral[];
          geometryElementsLatLngArray.push(...polygonCoordinates);
          currentInstanceType = 'polygon';
          break;
        }
        case (dataItem.instance instanceof google.maps.Marker): {
          const markerCoordinates = dataItem.coordinates as google.maps.LatLngLiteral;
          geometryElementsLatLngArray.push(markerCoordinates);
          currentInstanceType = 'marker';
          break;
        }
        default: break;
      }

      return ({
          id: dataItem.id, 
          coordinates: dataItem.coordinates,
          type: currentInstanceType
        } as  SingleAOIType
      );
  });

  return ({
    item: currentAOI,
    area: geometryElementsLatLngArray
  })
}