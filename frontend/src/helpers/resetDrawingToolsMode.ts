export const resetDrawingToolsMode = (
    drawingManagerReference: google.maps.drawing.DrawingManager
) => {
    drawingManagerReference?.setDrawingMode(null);
}