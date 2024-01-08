import './left-menu.scss';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { 
  selectLoadedAOI,
  selectSelectedItemId,
  deleteAOIItem,
}  from '../../features/loadedAOISlice';

type LeftMenuProps = {
    handleNavigationClick: (event: React.MouseEvent<HTMLDivElement>) => void,
}

const LeftMenu = ({
    handleNavigationClick,
}: LeftMenuProps) => {
    const loadedAOI = useAppSelector(selectLoadedAOI);
    const selectedItemId = useAppSelector(selectSelectedItemId);
    const dispatch = useAppDispatch();
   
    const navigationList = loadedAOI.map((item) => {
        const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
            const dataId = event.currentTarget.parentElement?.getAttribute('data-id');
            if (dataId) {
                dispatch(deleteAOIItem(dataId));
                // if data 
                // clear map , clear data
                
            }
        }
        if (item.id === selectedItemId) {
            return(
                <li key={item.id} data-id={item.id} className="item selected">
                    <div onClick={handleNavigationClick} >
                        <i>icon</i>
                        <span>{item.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </li>
            )
        } 
        return(
            <li key={item.id} data-id={item.id} className="item">
                <div onClick={handleNavigationClick} >
                    <i>icon</i>
                    <span>{item.name}</span>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </li>
        )
    });

   

    return (
        <div className="left-menu">
            <h2>Area Of Interes</h2>
            <nav>
                <ul>
                    {navigationList}
                </ul>
            </nav>
        </div>
        
    )
}

export default LeftMenu;