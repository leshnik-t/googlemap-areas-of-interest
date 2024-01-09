import './loading-popup.scss';

const LoadingPopup = () => {
    return(
        <>
        <div className="loadingpopup">
            <div className="loadingpopup-dialog">
                <div className="loadingpopup-content">
                    <div className="loadingpopup-header">
                        <h5 className="loadingpopup-title">Loading</h5>
                    </div>
                    <div className="loadingpopup-body">
                           <p>Please, wait a little bit!</p>
                    </div>
                    <div className="loadingpopup-footer">
                    </div>
                </div>
            </div>
        </div>  
        </>
    )
}

export default LoadingPopup;