import './save-popup.scss';

type SavePopupProps = {
    isSavePopupShown: boolean,
    nameAOI: string,
    errorNameAOI: string | null,
    handleChangeNameValue: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleCancelSaveAOI: () => void,
    handleSaveAOI: () => void
}

const SavePopup = ({
    isSavePopupShown,
    nameAOI,
    errorNameAOI,
    handleChangeNameValue,
    handleCancelSaveAOI,
    handleSaveAOI,
}: SavePopupProps) => {
    const isSavePopupShownClassName = isSavePopupShown ? 'savepopup show' : 'savepopup';
    return (
        <>
        <div className={isSavePopupShownClassName}>
            <div className="savepopup-dialog">
                <div className="savepopup-content">
                    <div className="savepopup-header">
                        <h5 className="savepopup-title">Save Area of Interest</h5>
                    </div>
                    <div className="savepopup-body">
                            <input
                                type="text" 
                                placeholder="enter name" 
                                area-label="Enter new AOI name" 
                                value={nameAOI}
                                onChange={handleChangeNameValue}
                            />
                            {errorNameAOI && 
                                <p>{errorNameAOI}</p>
                            }
                    </div>
                    <div className="savepopup-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleCancelSaveAOI}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleSaveAOI}
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default SavePopup;