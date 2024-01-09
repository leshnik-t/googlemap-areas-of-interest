import './delete-selected-geometry-element-popup.scss';

type WarningPopupProps = {
    isDeleteSelectedGeometryElementPopupShown: boolean,
    handleDeleteSelectedGeometryElementPopupProceed: () => void,
    handlDeleteSelectedGeometryElementPopupCancel: () => void,
}

const DeleteSelectedGeometryElementPopup = ({
    isDeleteSelectedGeometryElementPopupShown,
    handleDeleteSelectedGeometryElementPopupProceed,
    handlDeleteSelectedGeometryElementPopupCancel,
}: WarningPopupProps ) => {
    const isDeleteSelectedGeometryElementPopupClassName = isDeleteSelectedGeometryElementPopupShown ? 'deleteselectedpopup show' : 'deleteselectedpopup';
    return (
        <>
          <div className={isDeleteSelectedGeometryElementPopupClassName}>
            <div className="deleteselectedpopup-dialog">
                <div className="deleteselectedpopup-content">
                    <div className="deleteselectedpopup-header">
                        <h5 className="deleteselectedpopup-title">Warning</h5>
                    </div>
                    <div className="deleteselectedpopup-body">
                           <p>You are going to delete the selected item.</p>
                    </div>
                    <div className="deleteselectedpopup-footer">
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleDeleteSelectedGeometryElementPopupProceed}
                        >
                            Proceed
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handlDeleteSelectedGeometryElementPopupCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>  
        </>
    )   
}

export default DeleteSelectedGeometryElementPopup;