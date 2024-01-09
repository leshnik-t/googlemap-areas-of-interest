import './item.scss';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { 
    AOIItemType,
    selectSelectedItemId,
    deleteAOIItem,
}  from '../../features/loadedAOISlice';

import { RiDeleteBin6Fill } from "react-icons/ri";
import { PiShapesFill } from "react-icons/pi";

import DeleteAOIWarning from '../deleteAOIWarning/DeleteAOIWarning';
// event: React.MouseEvent<HTMLButtonElement>
type ItemProps = {
    item: AOIItemType,
    handleNavigationClick: (event: React.MouseEvent<HTMLDivElement>) => void,
}

const Item = ({
    item,
    handleNavigationClick,
}: ItemProps) => {
    const dispatch = useAppDispatch();
    const selectedItemId = useAppSelector(selectSelectedItemId);

    const itemClassName = (item.id === selectedItemId) ? 'item selected' : 'item';

    const [isDeleteMessageShown, setIsDeleteMessageShown] = useState<boolean>(false);

    const handleDelete = () => {
        setIsDeleteMessageShown(true);
        // const dataId = event.currentTarget.parentElement?.getAttribute('data-id');
        // if (dataId) {
        //     dispatch(deleteAOIItem(dataId));
        // }
    }

    const handleDeleteAOIWarningDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        const dataId = event.currentTarget.parentElement?.getAttribute('data-id');

        if (dataId) {
            dispatch(deleteAOIItem(dataId));
        }
        setIsDeleteMessageShown(false);
    }
    const handleDeleteAOIWarningCancel = () => {
        setIsDeleteMessageShown(false);
    }
    return (
        <li data-id={item.id} className={itemClassName}>
            {isDeleteMessageShown && 
                <DeleteAOIWarning
                    id={item.id}
                    handleDeleteAOIWarningDelete={handleDeleteAOIWarningDelete}
                    handleDeleteAOIWarningCancel={handleDeleteAOIWarningCancel}
                />}
            <div onClick={handleNavigationClick} >
                <i><PiShapesFill /></i>
                <span>{item.name}</span>
            </div>
            <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
            >
                <RiDeleteBin6Fill />
            </button>
        </li>
    )
}

export default Item;