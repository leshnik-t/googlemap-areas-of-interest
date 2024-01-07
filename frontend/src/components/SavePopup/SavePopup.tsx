import './save-popup.scss';
import React from 'react';

type SavePopupProps = {
    isSavePopupShown: boolean,
    nameValue: string,
    handleChangeNameValue: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleCancel: () => void,
    handleSave: () => void
}

const SavePopup = ({
    isSavePopupShown,
    nameValue,
    handleChangeNameValue,
    handleCancel,
    handleSave,
}: SavePopupProps) => {
    const isSavePopupShownClass = isSavePopupShown ? 'savepopup show' : 'savepopup';
    return (
        <>
        <div className={isSavePopupShownClass}>
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
                            value={nameValue}
                            onChange={handleChangeNameValue}
                        />
                    </div>
                    <div className="savepopup-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleSave}
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