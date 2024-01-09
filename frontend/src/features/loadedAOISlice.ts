import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type SingleAOIType = {
    id: string, 
    coordinates: google.maps.LatLngLiteral | google.maps.LatLngLiteral[],
    type: 'polygon' | 'marker';
}

export type MultipleAOIType = SingleAOIType[];

export type AOIItemType = {
    id: string,
    name: string,
    aoiData: MultipleAOIType,
    area: google.maps.LatLngLiteral[]
}

export type PayloadAddItemType = {
    item: AOIItemType,
    selectedItemId: string
}

export type AOIStateType = {
    items: AOIItemType[],
    selectedItemId: string
}

const initialState: AOIStateType = {
    items: [],
    selectedItemId: ''
}

const loadedAOISlice = createSlice({
    name: 'loadedAOI',
    initialState,
    reducers: {
        addAOIItem: (
            state, 
            action: PayloadAction<PayloadAddItemType>
        ) => {
            state.items.push(action.payload.item);
            state.selectedItemId = action.payload.selectedItemId;
        },
        deleteAOIItem: (
            state, 
            action: PayloadAction<string>
        ) => {
            const filteredAOI = state.items.filter((item) => item.id !== action.payload);

            if (filteredAOI) {
                return {
                    items: filteredAOI, 
                    selectedItemId: state.selectedItemId === action.payload ? '' : state.selectedItemId
                };
            }
        },
        changeSelectedItemId: (
            state, 
            action: PayloadAction<string>
        ) => {
            state.selectedItemId = action.payload;
        }
    },
});

export const { 
    addAOIItem, 
    deleteAOIItem,
    changeSelectedItemId
} = loadedAOISlice.actions;

export const selectLoadedAOI = (state: RootState) => state.loadedAOI.items;

export const selectSelectedItemId = (state: RootState) => state.loadedAOI.selectedItemId;

export default loadedAOISlice.reducer;