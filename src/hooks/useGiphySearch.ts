import { useReducer } from 'react';

const API_URL = __DEV__
  ? process.env.EXPO_PUBLIC_TEST_API
  : process.env.EXPO_PUBLIC_LIVE_API;

interface IGiphySearchState {
  data: IGiphySearchResult[];
  term: string;
  isLoading: boolean;
  isError: boolean;
}

interface IAction {
  type: 'setLoading' | 'setData' | 'setError';
  payload?: any;
}

export interface IGiphySearchResult {
  url: string;
  proxyUrl: string;
}

const initialState = {
  data: [],
  term: '',
  isLoading: false,
  isError: false,
};

interface UseGiphySearch {
  state: IGiphySearchState;
  search: (term: string) => Promise<void>;
  getTrending: () => Promise<void>;
}

export const useGiphySearch = (): UseGiphySearch => {
  const [state, dispatch] = useReducer(
    (state: IGiphySearchState, action: IAction) => {
      switch (action.type) {
        case 'setLoading':
          return {
            ...state,
            isLoading: true,
            isError: false,
            term: action.payload,
          };
        case 'setData':
          return {
            ...state,
            isLoading: false,
            isError: false,
            data: action.payload,
          };
        case 'setError':
          return { ...state, isLoading: false, isError: true };
        default:
          throw new Error();
      }
    },
    initialState,
  );

  const search = async (term: string): Promise<void> => {
    if (term === '') return;

    dispatch({ type: 'setLoading', payload: term });

    try {
      const response = await fetch(
        `${API_URL}/giphy/search?term=${encodeURIComponent(term)}`,
      );
      const data = await response.json();
      dispatch({ type: 'setData', payload: data });
    } catch (error) {
      dispatch({ type: 'setError' });
    }
  };

  const getTrending = async (): Promise<void> => {
    dispatch({ type: 'setLoading', payload: '' });

    try {
      const response = await fetch(`${API_URL}/trending`);
      const data = await response.json();
      dispatch({ type: 'setData', payload: data });
    } catch (error) {
      dispatch({ type: 'setError' });
    }
  };

  return { state, search, getTrending };
};
