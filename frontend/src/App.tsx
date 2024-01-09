import './App.scss';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { 
  selectLoadedAOI, 
  selectSelectedItemId,
  addAOIItem,
  changeSelectedItemId
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
import { createGeometryElementInstance } from './helpers/createGeometryElementInstance.ts';
import { calculateAOIDataAndArea } from './helpers/calculateAOIDataAndArea.ts';

import ToolsAOIControl from './components/toolAOIControl/ToolAOIControl';
import ToolOnOffButton from './components/toolAOIOnOffButton/ToolAOIOnOffButton';
import ToolAOIPopup from './components/toolAOIPopup/ToolAOIPopup';
import LeftMenu from './components/leftMenu/LeftMenu.tsx';
import SavePopup from './components/SavePopup/SavePopup.tsx';
import NewAOIPopup from './components/newAOIPopup/NewAOIPopup.tsx';
import WarningPopup from './components/warningPopup/WarningPopup.tsx';
import ErrorPopup from './components/errorPopup/ErrorPopup.tsx';
import LoadingPopup from './components/loadingPopup/LoadingPopup.tsx';
import DeleteSelectedGeometryElementPopup from './components/deleteSelectedGeometryElementPopup/DeleteSelectedGeometryPopup.tsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorPopupShown, setIsErrorPopupShown] = useState<boolean>(false);

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
  const selectedItemId = useAppSelector(selectSelectedItemId);
  const dispatch = useAppDispatch();

  /// Save AOI Popup
  const [isSavePopupShown, setIsSavePopupShown] = useState<boolean>(false);
  const [nameAOI, setNameAOI] = useState<string>('');
  const [errorNameAOI, setErrorNameAOI] = useState<string | null>(null);

  // New AOI popup
  const [isNewAOIPopupShown, setIsNewAOIPopupShown] = useState<boolean>(false);

  // Warning Popup
  const [isWarningPopupShown, setIsWarningPopupShown] = useState<boolean>(false);
 
  //Delete Selected Geometry Element Popup
  const [isDeleteSelectedGeometryElementPopupShown, setIsDeleteSelectedGeometryElementPopupShown] = useState<boolean>(false);

  // Drawing Buttons State
  const [isMarkerActive, setIsMarkerActive] = useState<boolean>(false);
  const [isPolygonActive, setIsPolygonActive] = useState<boolean>(false);
  const [isExploreActive, setIsExploreActive] = useState<boolean>(false);

  // Mobile Menu
  const [isMobileMenuShown, setIsMobileMenuShown] = useState<boolean>(false);

  const handleCloseMobileMenu = () => {
    setIsMobileMenuShown(false);
  }

  // Delete Selected Geometry Element Popup handlers
  const handleDeleteSelectedGeometryElementPopupProceed = () => {
    if (!selectedDataItemId) return;

    deleteGeometryElementFromMap(selectedDataItemId, data);

    // update data state
    const newData = data.filter((dataItem) => dataItem.id !== selectedDataItemId);
    setData(newData);

    mapGeometryElement.current = null;
    setSelectedDataItemId(null);
    setIsDeleteSelectedGeometryElementPopupShown(false);
  }
  const handlDeleteSelectedGeometryElementPopupCancel = () => {
    setIsDeleteSelectedGeometryElementPopupShown(false);
  }
  //end Delete Selected Geometry Element Popup handlers
  
  // New AOI Popup handlers
  const handleNewAOIPopupCancel = () => {
    if (!drawingRef.current) return;
   
    setIsActiveToolControl(false);
    setIsNewAOIPopupShown(false); 
  }

  const handleNewAOIPopupYes = () => {
    if (data.length === 0) return;
    clearSelection(data);

    // add event listeners to kept geometry elements
    data.map((dataItem) => {
      google.maps.event.addListener(dataItem.instance, 'click', function() {
        mapGeometryElement.current = dataItem.instance;
        setIsClickedGeometryElement(true);
      });
    });

    dispatch(changeSelectedItemId(''));
    setIsNewAOIPopupShown(false); 
  }

  const handleNewAOIPopupNo = () => {
    // clear everything painted on the map
    if (data.length === 0) return;
    data.map((dataItem) => dataItem.instance.setMap(null));
    setData([]);
    
    dispatch(changeSelectedItemId(''));
    setIsNewAOIPopupShown(false);
  }
  //end New AOI Popup handlers

  // Warning Popup handlers
  const handleWarningPopupYes = () => {
    // save data
    setIsSavePopupShown(true); 
    setIsWarningPopupShown(false);
  }
  const handleWarningPopupNo = () => {
    setIsWarningPopupShown(false);
  }
  //end Warning Popup handlers

 // Tool AOI Control handlers
 const handleToolsPopupMode = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    if (selectedItemId !== '') {
      setIsNewAOIPopupShown(true);
      setIsActiveToolControl(true);
    } else {
      setIsActiveToolControl(prev => !prev);
    }
    // setIsNewAOIPopupShown(true);
  }
  const handleAddPolygon = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;

    if (isMarkerActive) {
      setIsMarkerActive(false);
    }
    setIsPolygonActive((prev) => !prev);
    drawingRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  }
  const handleAddMarker = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;

    if (isPolygonActive) {
      setIsPolygonActive(false);
    }
    setIsMarkerActive((prev) => !prev);
    drawingRef.current.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
  }
  const handleExploreMap = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    
    setIsExploreActive((prev) => !prev);
    setIsMarkerActive(false);
    setIsPolygonActive(false);
    drawingRef.current.setDrawingMode(null);
  }
  const handleDeleteSelectedItem = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    if (!selectedDataItemId) return;
    setIsDeleteSelectedGeometryElementPopupShown(true);
  }
  const handleSaveShowPopup = () => {
    if (!mapRef.current) return;
    if (!drawingRef.current) return;
    if (data.length === 0) return;
    setIsSavePopupShown(true);
    setNameAOI('');
  };
  // end Tool AOI Control handlers


  // loading the selected AOI  
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (selectedItemId === '' && !isActiveToolContol) {
      data.map((dataItem) => dataItem.instance.setMap(null));
      setData([]);
    }
    // set new data and map.fitBounds to the data
    if (selectedItemId !== '') {
      setIsActiveToolControl(false);
       // clear everything painted on the map
      data.map((dataItem) => dataItem.instance.setMap(null));
      setData([]);

      const itemAOI = loadedAOI.find((item) => item.id === selectedItemId);

      if (itemAOI) {
        try {
          const newData:DataType[] = itemAOI.aoiData.map((item) => {
              const newDataItem = createGeometryElementInstance(item);
              if (!newDataItem) throw new Error('Wrong data in the database');

              return (newDataItem)
          });
          
          setData(newData);

          const bounds = new google.maps.LatLngBounds();
          itemAOI.area.map((pointLatLng) => bounds.extend(pointLatLng));
          mapRef.current.fitBounds(bounds);
          
        } catch(e) {
          console.log(e);
          setIsErrorPopupShown(true);
        }
      }
    }
  }, [selectedItemId, loadedAOI]);

  const handleChangeNameValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNameAOI(event.target.value);
    setErrorNameAOI(null);
  }

  const handleSaveAOI = () => {
    // prepare data for AOI dispatch
    if (nameAOI === '') {
      setErrorNameAOI('Please enter AOI name');
      return;
    }
    
    // calculate area of all geometry elements
    const {item, area} = calculateAOIDataAndArea(data);

    const newAOIId = nanoid();

    dispatch(addAOIItem({
        item: {
          id: newAOIId,
          name: nameAOI,
          aoiData: item,
          area: area
        },
        selectedItemId: newAOIId
    }));

    setIsSavePopupShown(false);
    setNameAOI('');
  }
  const handleCancelSaveAOI = () => {
    setNameAOI('');
    setErrorNameAOI(null);
    setIsSavePopupShown(false);
  }
 
  const handleNavigationClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (!mapRef.current) return;

    if (data.length !== 0 && selectedItemId === '') {
      setIsWarningPopupShown(true);
    } 

    if (!isWarningPopupShown) {
      const dataId = event.currentTarget.parentElement?.getAttribute('data-id');
      if (dataId) {
          dispatch(changeSelectedItemId(dataId));
      }
    }

    if (isMobileMenuShown) {
      setIsMobileMenuShown(false);
    }
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

  // Drawing Manager functions and geometry element listener
  const createDrawingManagerOverlayCompleteListener = useCallback(
    (
      drawingManagerReference: google.maps.drawing.DrawingManager
    ) => {
      google.maps.event.addListener(drawingManagerReference, 'overlaycomplete', function(event: google.maps.drawing.OverlayCompleteEvent) {
        setIsPolygonActive(false);
        setIsPolygonActive(false);
        setIsMarkerActive(false);
        const { overlay } = event;

        if (overlay) {
          window.google.maps.event.clearInstanceListeners(overlay);
          overlay.setMap(null);

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

 

  useEffect(() => {
      const initMap = async (): Promise<void> => {
      // The location of Uluru
        const initPosition = { lat: 25.774, lng: -80.19 };
        // Request needed libraries.
        try {
          const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
          const { DrawingManager } = await google.maps.importLibrary("drawing") as google.maps.DrawingLibrary;
          await google.maps.importLibrary("geometry") as google.maps.GeometryLibrary;
          
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
            setIsLoading(false);
          } 
        } catch(e) {
          console.log(e);
          setIsLoading(false);
          setIsErrorPopupShown(true);
        }
      }
      
      initMap();
      
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // clean everything form the map
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
    <div className="App">
      {isLoading && <LoadingPopup />}
      <button 
        className="mobile-button-menu"
        onClick={() => setIsMobileMenuShown(true)}
        >
          Areas of Interest List
      </button>
      <ErrorPopup isErrorPopupShown={isErrorPopupShown}/>
      <>
        <header></header>
        <main>
          
          <LeftMenu 
            isMobileMenuShown={isMobileMenuShown}
            handleNavigationClick={handleNavigationClick}
            handleCloseMobileMenu={handleCloseMobileMenu}
          />
          <ToolsAOIControl
            ref={toolsAOIMenuElement}>
            <ToolOnOffButton
              isActive={isActiveToolContol}
              areaLabel="Switch On Of AOI tool buttons"
              handleToolsPopupMode={handleToolsPopupMode}
            >
            </ToolOnOffButton>
            <ToolAOIPopup 
              isActive={isActiveToolContol} 
              handleAddMarker={handleAddMarker}
              handleAddPolygon={handleAddPolygon}
              handleExploreMap={handleExploreMap}
              handleDeleteSelectedItem={handleDeleteSelectedItem}
              handleSaveAOI = {handleSaveShowPopup}
              data={data}
              isDeleteActive={selectedDataItemId}
              isMarkerActive={isMarkerActive}
              isPolygonActive={isPolygonActive}
              isExploreActive={isExploreActive}
            />
          </ToolsAOIControl>
          <section className="map-container" ref={mapDOMElement}>
              
          </section>
        </main>
        <SavePopup 
          isSavePopupShown={isSavePopupShown}
          nameAOI={nameAOI}
          errorNameAOI={errorNameAOI}
          handleChangeNameValue={handleChangeNameValue}
          handleCancelSaveAOI={handleCancelSaveAOI}
          handleSaveAOI={handleSaveAOI}
        />
        <NewAOIPopup 
          isNewAOIPopupShown={isNewAOIPopupShown}
          handleNewAOIPopupCancel={handleNewAOIPopupCancel}
          handleNewAOIPopupYes={handleNewAOIPopupYes}
          handleNewAOIPopupNo={handleNewAOIPopupNo}
        />
        <WarningPopup
          isWarningPopupShown={isWarningPopupShown}
          handleWarningPopupYes={handleWarningPopupYes}
          handleWarningPopupNo={handleWarningPopupNo}
        />
        <DeleteSelectedGeometryElementPopup
          isDeleteSelectedGeometryElementPopupShown={isDeleteSelectedGeometryElementPopupShown}
          handleDeleteSelectedGeometryElementPopupProceed={handleDeleteSelectedGeometryElementPopupProceed}
          handlDeleteSelectedGeometryElementPopupCancel={handlDeleteSelectedGeometryElementPopupCancel}
        />
      </>
    </div>
  );
}

export default App
