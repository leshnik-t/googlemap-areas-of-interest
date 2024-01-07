import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { nanoid } from 'nanoid';

export type SingleAOIType = {
    id: string, 
    coordinates: google.maps.LatLngLiteral | google.maps.LatLngLiteral[],
    type: 'polygon' | 'marker';
}

export type MultipleAOIType = SingleAOIType[];

export type AOIStateType = {
    id?: string,
    name?: string,
    aoiData: MultipleAOIType

}

const initialState: AOIStateType[] = [];

const loadedAOISlice = createSlice({
    name: 'loadedAOI',
    initialState,
    reducers: {
        addAOIItem: (
            state, 
            action: PayloadAction<MultipleAOIType>
        ) => {
            const newAOI = {
                id: nanoid(),
                name: 'first aoi',
                aoiData: action.payload,
            }
            state.push(newAOI);
        },
        // addAOIItem: (state, action: PayloadAction<AOIStateType>) => {

        // },

    },
});

export const { addAOIItem } = loadedAOISlice.actions;

export const selectLoadedAOI = (state: RootState) => state.loadedAOI;

export default loadedAOISlice.reducer;