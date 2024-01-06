import './App.scss';
import { useRef, useEffect, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

import { DataType, GeometryElementType } from './dataTypes/dataTypes';
import { 
  svgMarker, 
  DRAW_MODE_COLOR,
} from './helpers/constants';
import { prepareDataItem } from './helpers/prepareDataItem';
import { resetDrawingToolsMode } from './helpers/resetDrawingToolsMode';
import { renderGeometryElementsInMap } from './helpers/renderGeometryElementsInMap';
import { geometryElmentSetOptions } from './helpers/geometryElementSetOptions';
import { findSelectedDataItemId } from './helpers/findSelectedDataItemId';


import ToolsAOIControl from './components/toolAOIControl/ToolAOIControl';
import ToolOnOffButton from './components/toolAOIOnOffButton/ToolAOIOnOffButton';
import ToolAOIPopup from './components/toolAOIPopup/ToolAOIPopup';
import { LiaDrawPolygonSolid } from "react-icons/lia";

function App() {
  const mapDOMElement = useRef<HTMLElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const toolsAOIMenuElement = useRef<HTMLDivElement>(null);
  const mapGeometryElement = useRef<GeometryElementType | null>(null);

  const [isLoadedMapDrawingManager, setIsLoadedMapDrawingManager] = useState<boolean>(false);
  const [isLoadedGeometryElement, setIsLoadedGeometryElement] = useState<boolean>(false);

  const [isActiveToolContol, setIsActiveToolControl] = useState(false);

  const [data, setData] = useState<DataType[]>([]);
  const [selectedDataItemId, setSelectedDataItemId] = useState<string | null>(null);


  // drawing Manager functions
  const createDrawingManagerOverlayCompleteListener = useCallback(
    (
      drawingManagerReference: google.maps.drawing.DrawingManager
    ) => {
      google.maps.event.addListener(drawingManagerReference, 'overlaycomplete', function(event: google.maps.drawing.OverlayCompleteEvent) {
        const { overlay } = event;

        if (overlay) {
          window.google.maps.event.clearInstanceListeners(overlay);
          overlay.setMap(null);
          // resetDrawingButtons?.();

          const preparedItem = prepareDataItem(event);

          if (preparedItem) {
            const {geometryElement, coordinates} = preparedItem;
            mapGeometryElement.current = geometryElement;
            setIsLoadedGeometryElement(true);
            
            setData((prev) => [
              ...prev,
              {
                id: nanoid(),
                coordinates,
                instance: geometryElement,
              },
            ]);

          }
        }

        resetDrawingToolsMode(drawingManagerReference);
      });
    }, 
    []
  );

  // helper functions
  const resetSelection = (
    data: DataType[],
  ) => {
    console.log("reset selection color");

    data.forEach((dataItem) => {
      geometryElmentSetOptions(dataItem.instance, 'draw');
    });

    // renderGeometryElementsInMap(mapReference);
  }
  

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
           
            const drawingManagerObject = new DrawingManager({
              drawingMode: null,
              drawingControl: false,
              drawingControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
                drawingModes: [
                  google.maps.drawing.OverlayType.MARKER,
                  google.maps.drawing.OverlayType.CIRCLE,
                  // google.maps.drawing.OverlayType.POLYGON,
                  // google.maps.drawing.OverlayType.POLYLINE,
                  // google.maps.drawing.OverlayType.RECTANGLE,
                ],
              },
              markerOptions: {
                icon: {
                  ...svgMarker,
                  // anchor: new google.maps.Point(0, 0)
                }
              },
              polygonOptions: {
                strokeColor: DRAW_MODE_COLOR,
                fillColor: DRAW_MODE_COLOR
              },
            });

            drawingRef.current = drawingManagerObject;
            drawingManagerObject.setMap(googleMapObject);
            setIsLoadedMapDrawingManager(true);
          } 
        } catch(e) {
          console.log(e);
        }
      }
      initMap();
      
  }, []);


  useEffect(() => {
    if (mapRef.current) {
      renderGeometryElementsInMap(data, mapRef.current);
    }
  }, [data]);

  useEffect(() => {
    const onLoadCompleteDrawingManager = (
        drawingManagerReference: google.maps.drawing.DrawingManager
      ) => {
        if (!isLoadedMapDrawingManager) return;
         
        createDrawingManagerOverlayCompleteListener(drawingManagerReference);
    }

    if (drawingRef.current) {
      onLoadCompleteDrawingManager(drawingRef.current);
    }
  }, [isLoadedMapDrawingManager, createDrawingManagerOverlayCompleteListener]);

  useEffect(() => {
    // geometry element function
    const onLoadGeometryElementInMap = (
      geometryElement: GeometryElementType
    ) => {
      if(!isLoadedGeometryElement) return;
      
      google.maps.event.addListener(geometryElement, 'click', function() {
        console.log("you clicked me", geometryElement);
        // TODO: resetSelection
        resetSelection(data);

        if (data) {
          setSelectedDataItemId(findSelectedDataItemId(data, geometryElement));

          geometryElmentSetOptions(geometryElement, 'select');
        }
      });

      setIsLoadedGeometryElement(false);
      mapGeometryElement.current = null;
    }

    if (mapGeometryElement.current) {
      onLoadGeometryElementInMap(mapGeometryElement.current);
    }
  }, [isLoadedGeometryElement, data]);



  return (
    <>
      <button onClick={() => console.log("Data", data)}>show data state</button>
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
