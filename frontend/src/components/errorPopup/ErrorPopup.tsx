import './error-popup.scss';

type ErrorPopupProps = {
    isErrorPopupShown: boolean,
}

const ErrorPopup = ({
    isErrorPopupShown
}: ErrorPopupProps) => {
    const isErrorPopupShownClassName = isErrorPopupShown ? 'errorpopup show' : 'errorpopup';

    return(
        <>
        <div className={isErrorPopupShownClassName}>
            <div className="errorpopup-dialog">
                <div className="errorpopup-content">
                    <div className="errorpopup-header">
                        <h5 className="errorpopup-title">Warning</h5>
                    </div>
                    <div className="errorpopup-body">
                           <p>Something went wrong.</p>
                           <p>Please, reload the app!</p>
                    </div>
                    <div className="errorpopup-footer">
                    </div>
                </div>
            </div>
        </div>  
        </>
    )
}

export default ErrorPopup;