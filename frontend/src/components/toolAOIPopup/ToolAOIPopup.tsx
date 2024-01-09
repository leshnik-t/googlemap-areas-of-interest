import './tool-AOI-popup.scss';
import { DataType } from '../../dataTypes/dataTypes';
import { FaRegHandPaper } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosSave } from "react-icons/io";
import { PiPolygonBold } from "react-icons/pi";
import { TbPolygonOff } from "react-icons/tb";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { MdOutlineWrongLocation } from "react-icons/md";

type ToolAOIPopupProps = {
    isActive: boolean,
    handleAddMarker: () => void 
    handleAddPolygon: () => void,
    handleExploreMap: () => void,
    handleDeleteSelectedItem: () => void,
    handleSaveAOI: () => void,
    data: DataType[],
    isDeleteActive: string | null,
    isMarkerActive: boolean,
    isPolygonActive: boolean,
    isExploreActive: boolean
}

const ToolAOIPopup = ({ 
    isActive,
    handleAddMarker,
    handleAddPolygon,
    handleExploreMap,
    handleDeleteSelectedItem,
    handleSaveAOI,
    data,
    isDeleteActive,
    isMarkerActive,
    isPolygonActive,
    isExploreActive
} : ToolAOIPopupProps) => {
    const divCSSClassName = isActive ? 'active toolsAOIPopup' : 'toolsAOIPopup';
    const isDeleteDisabled = isDeleteActive === null ? true : false;
    const isSaveDisabled = data.length === 0 ? true : false;
    return (
        <div className={divCSSClassName} aria-labelledby="AOIToolsLabel">
          <h2 id="AOIToolsLabel">Area of Interest</h2>
          <div>
            <div className="drawing-buttons-container">
              <button 
                className={isExploreActive ? 'active' : ''}
                draggable="false" 
                aria-label="Explore Mode" 
                title={isExploreActive ? 'Enable Draw' : 'Disable Draw'}
                type="button" 
                onClick={handleExploreMap} 
              >
                <FaRegHandPaper />
              </button>
              <button
                className={isMarkerActive ? 'active' : ''}
                draggable="false"
                aria-label={isMarkerActive ? 'Cancel Marker' : 'Add Marker'}
                title={isMarkerActive ? 'Cancel Marker' : 'Add Marker'}
                type="button"
                onClick={handleAddMarker}
                disabled={isExploreActive ? true : false}
              >
                {isMarkerActive ?
                  <MdOutlineWrongLocation /> : <MdOutlineAddLocationAlt />
                }
              </button>
              <button
                className={isPolygonActive ? 'active' : ''}
                draggable="false"
                aria-label={isPolygonActive ? 'Cancel Polygon' : 'Draw Polygon'}
                title={isPolygonActive ? 'Cancel Polygon' : 'Draw Polygon'}
                type="button"
                onClick={handleAddPolygon}
                disabled={isExploreActive ? true : false}
              >
                {isPolygonActive ?
                  <TbPolygonOff /> : <PiPolygonBold />
                }
              </button>
              <button
                className="delete-btn"
                draggable="false"
                aria-label="Delete Selected Item"
                title="Delete Selected Item"
                type="button"
                onClick={handleDeleteSelectedItem}
                disabled={isDeleteDisabled}
              >
                <RiDeleteBinLine />
              </button>
            </div>
            <div className="save-button-container">
              <button
                draggable="false"
                aria-label="Save area"
                title="Save area"
                type="button"
                aria-checked="false"
                onClick={handleSaveAOI}
                disabled={isSaveDisabled}
              >
                <IoIosSave />
              </button>
            </div>
          </div>
        </div>
    )
}

export default ToolAOIPopup;