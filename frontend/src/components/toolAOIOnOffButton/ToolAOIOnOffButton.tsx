import './tool-AOI-on-off-button.scss';
import { LiaDrawPolygonSolid } from "react-icons/lia";
import { IoMdAddCircleOutline } from "react-icons/io";

type ToolAOIOnOffButtonProps = {
    isActive: boolean
    areaLabel: string,
    buttonText?: string,
    handleToolsPopupMode: () => void,
}

const ToolAOIOnOffButton = ({
    isActive,
    areaLabel, 
    buttonText, 
    handleToolsPopupMode, 
}: ToolAOIOnOffButtonProps) => {
    const btnIcon =  isActive ? <LiaDrawPolygonSolid/> : <IoMdAddCircleOutline/>;
    const buttonCSSClassName = isActive ? 'toolsAOIbutton active' : 'toolsAOIbutton'; 
    return (
        <button
            draggable="false"
            aria-label={areaLabel} 
            type="button"  
            className={buttonCSSClassName}
            onClick={handleToolsPopupMode}
        >
          {buttonText}
          {btnIcon}
        </button>
    )
}

export default ToolAOIOnOffButton;