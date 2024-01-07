import './App.scss';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { 
  SingleAOIType,
  selectLoadedAOI, 
  addAOIItem 
}  from './features/loadedAOISlice';

import { nanoid } from 'nanoid';

import { 
          DataType, 
          GeometryElementType,
} from './dataTypes/dataTypes';
import { 
  svgMarker, 
  DRAW_MODE_COLOR,
} from './helpers/constants';

import { resetDrawingToolsMode } from './helpers/resetDrawingToolsMode';
import { prepareDataItem } from './helpers/prepareDataItem';
import { renderGeometryElementsInMap } from './helpers/renderGeometryElementsInMap';
import { findSelectedDataItemId } from './helpers/findSelectedDataItemId';
import { geometryElementSetOptions } from './helpers/geometryElementSetOptions';
import { deleteGeometryElementFromMap } from './helpers/deleteGeometryElementFromMap';

import ToolsAOIControl from './components/toolAOIControl/ToolAOIControl';
import ToolOnOffButton from './components/toolAOIOnOffButton/ToolAOIOnOffButton';
import ToolAOIPopup from './components/toolAOIPopup/ToolAOIPopup';
import { LiaDrawPolygonSolid } from "react-icons/lia";
import SavePopup from './components/SavePopup/SavePopup.tsx';

function App() {
  const mapDOMElement = useRef<HTMLElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const toolsAOIMenuElement = useRef<HTMLDivElement>(null);

  const [isLoadedMapDrawingManager, setIsLoadedMapDrawingManager] = useState<boolean>(false);
  const [isLoadedGeometryElement, setIsLoadedGeometryElement] = useState<boolean>(false);

  const [isActiveToolContol, setIsActiveToolControl] = useState(false);

  const [data, setData] = useState<DataType[]>([]);
  const [selectedDataItemId, setSelectedDataItemId] = useState<string | null>(null);
  const [isClickedGeometryElement, setIsClickedGeometryElement] = useState<boolean>(false);
  const mapGeometryElement = useRef<GeometryElementType | null>(null);

  const loadedAOI = useAppSelector(selectLoadedAOI);
  const dispatch = useAppDispatch();

  /// save popup
  const [isSavePopupShown, setIsSavePopupShown] = useState<boolean>(false);
  const [nameAOI, setNameAOI] = useState<string>('');

  const handleChangeNameValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNameAOI(event.target.value);
  }

  const handleSaveAOI = () => {
    // prepare data for AOI dispatch
    const currentAOI = data.map((dataItem) => {
      let currentInstanceType;
      switch(true) {
        case (dataItem.instance instanceof google.maps.Polygon): {
          currentInstanceType = 'polygon';
          break;
        }
        case (dataItem.instance instanceof google.maps.Marker): {
          currentInstanceType = 'marker';
          break;
        }
        default: break;
      }

      return ({
        id: dataItem.id, 
        coordinates: dataItem.coordinates,
        type: currentInstanceType
      } as  SingleAOIType)
    });
    console.log("currentAOI", currentAOI);
    // ask for a name from popup
    dispatch(addAOIItem({
      name: nameAOI,
      aoiData: currentAOI
    }));
    
    setIsSavePopupShown(false);
    setNameAOI('');
    
    // load new dispatched element in data
    // on load change color of the saved Geometry elements to white
  }
  const handleCancelSaveAOI = () => {
    setIsSavePopupShown(false);
  }

  const clearSelection = useCallback(
    (
      data: DataType[],
    ) => {
      const [...copyOfData] = [...data];
      copyOfData.map((dataItem) => {
        geometryElementSetOptions(dataItem.instance, 'draw');
      });
      
      setData(copyOfData);
   },
   []
  );

  useEffect(() => {
    if (isClickedGeometryElement) {
      clearSelection(data);

      if (mapGeometryElement.current) {
        const selectedItemId = findSelectedDataItemId(data, mapGeometryElement.current);
        setSelectedDataItemId(selectedItemId);

        // setting data
        const [...copyOfData] = [...data]
        copyOfData.map((dataItem) => {
          if (dataItem.id === selectedItemId) {
            geometryElementSetOptions(dataItem.instance, 'select');
          }
        })

        setData(copyOfData);
        mapGeometryElement.current = null;
      }
    }
    setIsClickedGeometryElement(false);
  }, [isClickedGeometryElement, data, clearSelection]);

  // Drawing Manager functions
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

            setData((prev) => [
              ...prev,
              {
                id: nanoid(),
                coordinates,
                instance: geometryElement,
              },
            ]);

            mapGeometryElement.current = geometryElement;
            setIsLoadedGeometryElement(true);
          }
        }

        resetDrawingToolsMode(drawingManagerReference);
      });
    }, 
    []
  );

  // Tool AOI Control handlers
  const handleToolsPopupMode = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    setIsActiveToolControl(prev => !prev);
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
  const handleDeleteSelectedItem = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    if (!selectedDataItemId) return;
    console.log("click delete");
    // id
    console.log("item id", selectedDataItemId);

    deleteGeometryElementFromMap(selectedDataItemId, data);

    // update data state

    const newData = data.filter((dataItem) => dataItem.id !== selectedDataItemId);
    console.log('New Data', newData);
    setData(newData);

    mapGeometryElement.current = null;
    setSelectedDataItemId(null);
  }
  const handleSaveShowPopup = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    if (data.length === 0) return;
    setIsSavePopupShown(true);
  };
  // end Tool AOI Control handlers

  useEffect(() => {
      const initMap = async (): Promise<void> => {
      // The location of Uluru
        const initPosition = { lat: 25.774, lng: -80.19 };
        // Request needed libraries.
        try {
          const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
          const { DrawingManager } = await google.maps.importLibrary("drawing") as google.maps.DrawingLibrary;
          
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
      console.log("render elements");
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
    const onLoadGeometryElementInMap = (
      geometryElement: GeometryElementType,
    ) => {
      if(!isLoadedGeometryElement) return;

      google.maps.event.addListener(geometryElement, 'click', function() {
        mapGeometryElement.current = geometryElement;
        setIsClickedGeometryElement(true);
      });

      setIsLoadedGeometryElement(false);
    }

    if (mapGeometryElement.current) {
      onLoadGeometryElementInMap(mapGeometryElement.current);
    }
  }, [isLoadedGeometryElement]);

  return (
    <>
      <SavePopup 
        isSavePopupShown={isSavePopupShown}
        nameValue={nameAOI}
        handleChangeNameValue={handleChangeNameValue}
        handleCancel={handleCancelSaveAOI}
        handleSave={handleSaveAOI}
      />
      <button onClick={() => console.log("store state", loadedAOI)}>show store state</button>
      <button onClick={() => clearSelection(data)}>Clear selection</button>
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
            handleDeleteSelectedItem={handleDeleteSelectedItem}
            handleSaveAOI = {handleSaveShowPopup}
          />
      </ToolsAOIControl>
      <section id="map" ref={mapDOMElement}>
          
      </section>
    </>
  );
}

export default App
