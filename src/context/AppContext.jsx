import { createContext, useContext, useReducer, useCallback } from 'react';

// Types d'actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DATA: 'SET_DATA',
  ADD_ENTRY: 'ADD_ENTRY',
  UPDATE_STATS: 'UPDATE_STATS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// État initial
const initialState = {
  loading: false,
  error: null,
  data: {
    entries: [],
    varietes: [],
    stats: {
      total: 0,
      moyenneHebdo: 0,
      tendance: 0,
      typePopulaire: '',
      repartitionPopulaire: '',
    },
  },
  filters: {
    dateRange: null,
    varieteType: null,
    repartition: null,
  },
};

// Reducer pour gérer les actions
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.SET_DATA:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: false,
      };

    case ACTIONS.ADD_ENTRY:
      return {
        ...state,
        data: {
          ...state.data,
          entries: [action.payload, ...state.data.entries],
        },
      };

    case ACTIONS.UPDATE_STATS:
      return {
        ...state,
        data: {
          ...state.data,
          stats: { ...state.data.stats, ...action.payload },
        },
      };

    default:
      return state;
  }
};

// Création du contexte
const AppContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext doit être utilisé dans un AppProvider');
  }
  return context;
};

// Provider du contexte
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setLoading = useCallback(loading => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback(error => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  const setData = useCallback(data => {
    dispatch({ type: ACTIONS.SET_DATA, payload: data });
  }, []);

  const addEntry = useCallback(entry => {
    dispatch({ type: ACTIONS.ADD_ENTRY, payload: entry });
  }, []);

  const updateStats = useCallback(stats => {
    dispatch({ type: ACTIONS.UPDATE_STATS, payload: stats });
  }, []);

  const value = {
    ...state,
    actions: {
      setLoading,
      setError,
      clearError,
      setData,
      addEntry,
      updateStats,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
