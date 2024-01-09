import './new-AOI-popup.scss';
import { useAppSelector } from '../../app/hooks';
import { 
    selectSelectedItemId,
    selectLoadedAOI
} from '../../features/loadedAOISlice';

type NewAOIPopupProps = {
    isNewAOIPopupShown: boolean,
    handleNewAOIPopupCancel: () => void,
    handleNewAOIPopupYes: () => void,
    handleNewAOIPopupNo: () => void,
}

const NewAOIPopup = ({
    isNewAOIPopupShown,
    handleNewAOIPopupCancel,
    handleNewAOIPopupYes,
    handleNewAOIPopupNo,
}: NewAOIPopupProps) => {
    const selectedItemId = useAppSelector(selectSelectedItemId);
    const loadedAOI = useAppSelector(selectLoadedAOI);

    const itemAOIName = loadedAOI.find((item) => item.id ===selectedItemId);

    const isNewAOIPopupShownClassName = isNewAOIPopupShown ? 'newaoipopup show' : 'newaoipopup';

    return (
        <>
        <div className={isNewAOIPopupShownClassName}>
            <div className="newaoipopup-dialog">
                <div className="newaoipopup-content">
                    <div className="newaoipopup-header">
                        <h5 className="newaoipopup-title">New Area of Interest</h5>
                    </div>
                    <div className="newaoipopup-body">
                           <p>Would you like to keep all the markers and polygons from {itemAOIName?.name}?</p>
                    </div>
                    <div className="newaoipopup-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleNewAOIPopupCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleNewAOIPopupYes}
                        >
                            Yes
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleNewAOIPopupNo}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
        
    )
}

export default NewAOIPopup;