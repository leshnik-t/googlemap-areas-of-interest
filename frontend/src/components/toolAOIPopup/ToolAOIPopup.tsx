import './tool-AOI-popup.scss';
import { FaDrawPolygon } from "react-icons/fa";
import { FaRegHandPaper } from "react-icons/fa";
import { LiaMapMarkerSolid } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineSave } from "react-icons/ai";

type ToolAOIPopupProps = {
    isActive: boolean,
    handleAddMarker: () => void 
    handleAddPolygon: () => void,
    handleExploreMap: () => void,
    handleDeleteSelectedItem: () => void,
    handleSaveAOI: () => void
}

const ToolAOIPopup = ({ 
    isActive,
    handleAddMarker,
    handleAddPolygon,
    handleExploreMap,
    handleDeleteSelectedItem,
    handleSaveAOI

} : ToolAOIPopupProps) => {
    const divCSSClassName = isActive ? 'active tools-popup' : 'tools-popup'
    return (
        <div className={divCSSClassName}>
          <h2>Area of Interest</h2>
          <div>
            <button 
              draggable="false" 
              aria-label="Explore Map" 
              title="Explore Map" 
              type="button" 
              role="menuitemradio" 
              aria-checked="false"
              onClick={handleExploreMap} 
            >
              <FaRegHandPaper />
            </button>
            <button
              draggable="false"
              aria-label="Add a marker"
              title="Add a marker"
              type="button"
              role="menuitemradio"
              aria-checked="false"
              onClick={handleAddMarker}
            >
              <LiaMapMarkerSolid />
            </button>
            <button
              draggable="false"
              aria-label="Draw a shape"
              title="Draw a shape"
              type="button"
              role="menuitemradio"
              aria-checked="false"
              onClick={handleAddPolygon}
            >
              <FaDrawPolygon />
            </button>
            <button
              draggable="false"
              aria-label="Delete Selected AOI"
              title="Delete Selected AOI"
              type="button"
              role="menuitemradio"
              aria-checked="false"
              onClick={handleDeleteSelectedItem}
            >
              <RiDeleteBinLine />
            </button>
            <button
              draggable="false"
              aria-label="Save area"
              title="Save area"
              type="button"
              role="menuitemradio"
              aria-checked="false"
              onClick={handleSaveAOI}
            >
              <AiOutlineSave />
            </button>
          </div>
        </div>
    )
}

export default ToolAOIPopup;