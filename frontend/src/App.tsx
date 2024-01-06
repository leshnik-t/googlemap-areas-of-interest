import './App.scss';
import { useRef, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { PolygonType } from './dataTypes/dataTypes';
import { coordinateFuncsToCoordinates } from './utils/coordinateFuncsToCoordinates';

import ToolsAOIControl from './components/toolAOIControl/ToolAOIControl';
import ToolOnOffButton from './components/toolAOIOnOffButton/ToolAOIOnOffButton';
import ToolAOIPopup from './components/toolAOIPopup/ToolAOIPopup';
import { LiaDrawPolygonSolid } from "react-icons/lia";

const POLYGON_NODES_MIN_QUANTITY = 3;

function App() {
  const mapDOMElement = useRef<HTMLElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const toolsAOIMenuElement = useRef<HTMLDivElement>(null);

  const [isActiveToolContol, setIsActiveToolControl] = useState(false);

  // keeps drawn polygons
  const [polygons, setPolygons] = useState<PolygonType[]>([]);

  const renderGeometryElementsInMap = (
    geometryElementsArray: PolygonType[],
    mapReference: google.maps.Map
  ) => {
    if (geometryElementsArray.length === 0) return;

    geometryElementsArray.map((geometryElement) => {
      geometryElement.polygonInstance.setMap(mapReference);
    })
  }
   

  const resetDrawingToolsMode = () => {
    drawingRef.current?.setDrawingMode(null);
  };

  // Tool AOI Control handlers
  const handleToolsPopupMode = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    setIsActiveToolControl(prev => !prev);

    // drawingRef.setOptions({drawingControl: isActive});
  }
  const handleAddPolygon = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    console.log("add polygon");
    drawingRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  }
  const handleAddMarker = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    console.log("add marker");
    drawingRef.current.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
  }
  const handleExploreMap = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    console.log("click explore");
    drawingRef.current.setDrawingMode(null);
  }
  // end Tool AOI Control handlers
  
  useEffect(() => {
      const initMap = async (): Promise<void> => {
      // The location of Uluru
        const initPosition = { lat: 25.774, lng: -80.19 };
        // Request needed libraries.
        try {
          const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
          const { DrawingManager } = await google.maps.importLibrary("drawing") as google.maps.DrawingLibrary;
          // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary; 
          
          if(mapDOMElement.current) {
            const googleMapObject = new Map(
              mapDOMElement.current,
              {
                zoom: 5,
                center: initPosition,
                mapId: 'AOI_MAP_ID',
                mapTypeId: 'hybrid',
                disableDefaultUI: true,
                zoomControl: true,
                scaleControl: true,
                gestureHandling: "greedy",
                maxZoom: 17,
                minZoom: 4
              }
            );
            mapRef.current = googleMapObject;

            // Tools Control for Google Map
            if (toolsAOIMenuElement.current) {
              googleMapObject.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(toolsAOIMenuElement.current);
            }
           
            /// Drawing Manager
            const svgMarker = {
              path: "M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z",
              fillColor: "blue",
              fillOpacity: 0.6,
              strokeWeight: 0,
              rotation: 0,
              scale: 0.05,
              anchor: new google.maps.Point(0, 20),
            };

            const drawingManagerObject = new DrawingManager({
              drawingMode: null,
              drawingControl: false,
              drawingControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
                drawingModes: [
                  google.maps.drawing.OverlayType.MARKER,
                  google.maps.drawing.OverlayType.CIRCLE,
                  google.maps.drawing.OverlayType.POLYGON,
                  google.maps.drawing.OverlayType.POLYLINE,
                  google.maps.drawing.OverlayType.RECTANGLE,
                ],
              },
              markerOptions: {
                icon: svgMarker,
              },
              polygonOptions: {
              },
            });
            drawingRef.current = drawingManagerObject;
            drawingManagerObject.setMap(googleMapObject);

            // On draw of the shape completes
            google.maps.event.addListener(drawingManagerObject, 'overlaycomplete', function(event: google.maps.drawing.OverlayCompleteEvent) {
              const { type, overlay } = event;

              if (overlay) {
                window.google.maps.event.clearInstanceListeners(overlay);
                overlay.setMap(null);
                // resetDrawingButtons?.();

                if (type === google.maps.drawing.OverlayType.POLYGON) {
                  const typedOverlay = overlay as google.maps.Polygon;
                  const coordinateFuncs: google.maps.LatLng[] = typedOverlay
                    .getPath()
                    .getArray();

                  const coordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  if (coordinates.length < POLYGON_NODES_MIN_QUANTITY) {
                    return;
                  }

                  const polygonItem = new google.maps.Polygon({
                    paths: coordinates,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                  });
            
                  google.maps.event.addListener(polygonItem, 'click', function() {
                    console.log("you clicked me", polygonItem);
                    polygonItem.setOptions({
                      fillColor : '#0000ff',
                    });
                  });

                  setPolygons((prevPolygons) => [
                    ...prevPolygons,
                    {
                      id: nanoid(),
                      coordinates,
                      polygonInstance: polygonItem,
                    },
                  ]);

                  resetDrawingToolsMode();
                }
              }
            }); // end On draw of the shape completes


          } 
        } catch(e) {
          console.log(e);
        }
      }
      initMap();
      
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      renderGeometryElementsInMap(polygons, mapRef.current);
    }
  }, [polygons])

  return (
    <>
      <ToolsAOIControl
        ref={toolsAOIMenuElement}>
         <ToolOnOffButton
            isActive={isActiveToolContol}
            areaLabel="Switch On Of AOI tool buttons"
            handleToolsPopupMode={handleToolsPopupMode}
          >
            <LiaDrawPolygonSolid />
          </ToolOnOffButton>
          <ToolAOIPopup 
            isActive={isActiveToolContol} 
            handleAddMarker={handleAddMarker}
            handleAddPolygon={handleAddPolygon}
            handleExploreMap={handleExploreMap}
          />
      </ToolsAOIControl>
      <section id="map" ref={mapDOMElement}>
          
      </section>
    </>
  );
}

export default App
