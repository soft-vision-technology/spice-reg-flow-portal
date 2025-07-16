import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchExistingExporters = createAsyncThunk(
    'report/fetchExistingExporters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/existing/exporters');
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const fetchStartingExporters = createAsyncThunk(
    'report/fetchStartingExporters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/starting/exporters');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const fetchExistingEntrepreneurs = createAsyncThunk(
    'report/fetchExistingEntrepreneurs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/existing/entrepreneurs');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const fetchStartingEntrepreneurs = createAsyncThunk(
    'report/fetchStartingEntrepreneurs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/starting/entrepreneurs');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const fetchExistingTraders = createAsyncThunk(
    'report/fetchExistingTraders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/existing/traders');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const fetchStartingTraders = createAsyncThunk(
    'report/fetchStartingTraders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/users/starting/traders');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const initialState = {
    existingExporters: [],
    startingExporters: [],
    existingEntrepreneurs: [],
    startingEntrepreneurs: [],
    existingTraders: [],
    startingTraders: [],
    loading: false,
    error: null,
};

const reportSlice = createSlice({
    name: 'reports',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchExistingExporters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExistingExporters.fulfilled, (state, action) => {
                state.loading = false;
                state.existingExporters = action.payload;
            })
            .addCase(fetchExistingExporters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(fetchStartingExporters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStartingExporters.fulfilled, (state, action) => {
                state.loading = false;
                state.startingExporters = action.payload;
            })
            .addCase(fetchStartingExporters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })


            .addCase(fetchExistingEntrepreneurs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExistingEntrepreneurs.fulfilled, (state, action) => {
                state.loading = false;
                state.existingEntrepreneurs = action.payload;
            })
            .addCase(fetchExistingEntrepreneurs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(fetchStartingEntrepreneurs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStartingEntrepreneurs.fulfilled, (state, action) => {
                state.loading = false;
                state.startingEntrepreneurs = action.payload;
            })
            .addCase(fetchStartingEntrepreneurs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })


            .addCase(fetchExistingTraders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExistingTraders.fulfilled, (state, action) => {
                state.loading = false;
                state.existingTraders = action.payload;
            })
            .addCase(fetchExistingTraders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(fetchStartingTraders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStartingTraders.fulfilled, (state, action) => {
                state.loading = false;
                state.startingTraders = action.payload;
            })
            .addCase(fetchStartingTraders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

    }
});

export default reportSlice.reducer;