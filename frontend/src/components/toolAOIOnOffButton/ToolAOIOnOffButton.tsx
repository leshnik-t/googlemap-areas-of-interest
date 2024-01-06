import './tool-AOI-on-off-button.scss';
import { ReactNode } from 'react';

type ToolAOIOnOffButtonProps = {
    isActive: boolean
    areaLabel: string,
    buttonText?: string,
    children?: ReactNode
    handleToolsPopupMode: () => void,
}

const ToolAOIOnOffButton = ({
    isActive,
    areaLabel, 
    buttonText, 
    children,
    handleToolsPopupMode, 
}: ToolAOIOnOffButtonProps) => {
    const buttonCSSClassName = isActive ? 'tools-button active' : 'tools-button';
    return (
        <button
            draggable="false"
            aria-label={areaLabel} 
            type="button"  
            className={buttonCSSClassName}
            onClick={handleToolsPopupMode}
        >
          {buttonText}
          {children}
        </button>
    )
}

export default ToolAOIOnOffButton;