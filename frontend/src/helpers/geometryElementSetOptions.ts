import { 
    svgMarker, 
    EXPLORE_MODE_COLOR,
    DRAW_MODE_COLOR,
    SELECT_MODE_COLOR,
} from './constants';
import { 
  GeometryElementType,
  ModeType
} from '../dataTypes/dataTypes';

export const geometryElementSetOptions = (
    geometryElement: GeometryElementType,
    mode: ModeType
) => {
    let color;
    switch(true) {
        case (mode === 'explore'): {
            color = EXPLORE_MODE_COLOR;
            break;
        }
        case (mode === 'draw'): {
            color = DRAW_MODE_COLOR;
            break;
        }
        case (mode === 'select'): {
            color = SELECT_MODE_COLOR;
            break;
        }
        default: break;
    }

    switch(true) {
        case (geometryElement instanceof google.maps.Polygon): {
          geometryElement.setOptions({
            strokeColor: color,
            fillColor: color,
          });
          break;
        }
        case (geometryElement instanceof google.maps.Marker): {
          geometryElement.setOptions({
            icon : {
              ...svgMarker,
              fillColor: color,
              strokeColor: color
            }
          });
          break;
        }
        default: break;
    }
}