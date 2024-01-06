import { DataType, GeometryElementType } from "../dataTypes/dataTypes";

export const findSelectedDataItemId = (
    data: DataType[],
    geometryElement: GeometryElementType
  ) => {

    const selectedItem = data.find((dataItem) => dataItem.instance === geometryElement);

    return (selectedItem ? selectedItem.id : null);
}