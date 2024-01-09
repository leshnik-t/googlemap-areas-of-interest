import { DataType } from '../dataTypes/dataTypes';

export const renderGeometryElementsInMap = (
    dataArray: DataType[],
    mapReference: google.maps.Map
) => {
    if (dataArray.length === 0) return;

    dataArray.map((dataItem) => {
      dataItem.instance.setMap(mapReference);
    })
}