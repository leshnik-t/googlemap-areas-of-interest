import { DataType } from '../dataTypes/dataTypes';

export const deleteGeometryElementFromMap = (
    selectedDataItemId: string,
    data: DataType[]
) => {
    const findElement = data.find((dataItem) => dataItem.id === selectedDataItemId);

    if (findElement) {
      findElement.instance.setMap(null);
    }
}