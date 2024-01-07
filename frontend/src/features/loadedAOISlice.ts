import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type SingleAOI = {
    id: string, 
    coordinates: google.maps.LatLng | google.maps.LatLngLiteral[],
    type: 'polygon' | 'marker';
}

export type AOIStateType = {
    id: string,
    name: string,
    aoiData: SingleAOI[]
}

const initialState: AOIStateType[] = [];

const loadedAOISlice = createSlice({
    name: 'loadedAOI',
    initialState,
    reducers: {
        addAOIItem: (
            state, 
            action: PayloadAction<AOIStateType>
        ) => {
            state.concat(action.payload);
            console.log("Add item, state is", state);
        },
        // addAOIItem: (state, action: PayloadAction<AOIStateType>) => {

        // },

    },
});

export const { addAOIItem } = loadedAOISlice.actions;

export const selectLoadedAOI = (state: RootState) => state.loadedAOI;

export default loadedAOISlice.reducer;