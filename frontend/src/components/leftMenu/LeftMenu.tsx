import './left-menu.scss';
import { useAppSelector } from '../../app/hooks';
import { 
  selectLoadedAOI,
}  from '../../features/loadedAOISlice';
import { MdOutlineClose } from "react-icons/md";

import Item from './Item';

type LeftMenuProps = {
    isMobileMenuShown: boolean,
    handleNavigationClick: (event: React.MouseEvent<HTMLDivElement>) => void,
    handleCloseMobileMenu: () => void
}

const LeftMenu = ({
    isMobileMenuShown,
    handleNavigationClick,
    handleCloseMobileMenu
}: LeftMenuProps) => {
    const loadedAOI = useAppSelector(selectLoadedAOI);
    const numberOfAreas = loadedAOI.length;
    
    const navigationList = loadedAOI.map((item) => {
        return (
            <Item key={item.id} 
                item={item}
                handleNavigationClick={handleNavigationClick}
            />
        )
    });

    const isMobileMenuShownClassName = isMobileMenuShown ? 'show' : '';

    return (
        <div className={`left-menu ${isMobileMenuShownClassName}`}>
            <h2 id="myAreas">
                My Areas Of Interest 
                <button 
                    type="button"
                    className="btn-close-mobile-menu"
                    onClick={handleCloseMobileMenu}
                >
                    <MdOutlineClose />
                </button>
            </h2>
            <p>Counted ( {numberOfAreas} )</p>
            <nav area-llabeledby="myAreas">
                <ul>
                    {navigationList}
                </ul>
            </nav>
        </div>
        
    )
}

export default LeftMenu;