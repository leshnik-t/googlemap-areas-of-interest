import './tool-AOI-control.scss';
import { forwardRef, ReactNode } from 'react';

type ToolAOIControlProps = {
  children?: ReactNode,
  className?: string
}

export type Ref = HTMLDivElement;

const ToolAOIControl = forwardRef<Ref, ToolAOIControlProps>((props, ref) => {
  const divCSSClassName = props.className ? `tools-menu ${props.className}` : 'tools-menu'

  return (
    <div 
      className={divCSSClassName}
      role="menubar"
      ref={ref}
    >
      {props.children}
    </div>  
  )
});

export default ToolAOIControl;