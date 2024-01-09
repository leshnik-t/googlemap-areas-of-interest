import './warning-popup.scss';

type WarningPopupProps = {
    isWarningPopupShown: boolean,
    handleWarningPopupYes: () => void,
    handleWarningPopupNo: () => void,
}

const WarningPopup = ({
    isWarningPopupShown,
    handleWarningPopupYes,
    handleWarningPopupNo,
}: WarningPopupProps ) => {
    const isWarningPopupShownClassName = isWarningPopupShown ? 'warningpopup show' : 'warningpopup';
    return (
        <>
          <div className={isWarningPopupShownClassName}>
            <div className="warningpopup-dialog">
                <div className="warningpopup-content">
                    <div className="warningpopup-header">
                        <h5 className="warningpopup-title">Warning</h5>
                    </div>
                    <div className="warningpopup-body">
                           <p>You will lost you currently drawn elements.</p>
                           <p>Do you want to save them now?</p>
                    </div>
                    <div className="warningpopup-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleWarningPopupYes}
                        >
                            Yes
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={handleWarningPopupNo}
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

export default WarningPopup;