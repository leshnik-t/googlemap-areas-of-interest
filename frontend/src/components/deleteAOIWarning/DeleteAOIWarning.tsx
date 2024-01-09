// import './delete-AOI-warning.scss;'

type DeleteAOIWarningProps = {
    id: string
    handleDeleteAOIWarningDelete: (event: React.MouseEvent<HTMLButtonElement>) => void,
    handleDeleteAOIWarningCancel: () => void
}

const DeleteAOIWarning = ({
    id,
    handleDeleteAOIWarningDelete,
    handleDeleteAOIWarningCancel
}: DeleteAOIWarningProps) => {
    return (
        <div data-id={id} className="deleteAOIWarning">
            <p>Are you sure you want to delete this item?</p>
            <button
                type='button'
                className='btn btn-primary'
                onClick={handleDeleteAOIWarningDelete}
            >
                Yes
            </button>
            <button
                type='button'
                className='btn btn-secondary'
                onClick={handleDeleteAOIWarningCancel}
            >
                No
            </button>
        </div>
    )
}

export default DeleteAOIWarning;