const initialState = {
  input: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_INPUT': {
      const { input } = action.payload;
      return {
        ...state,
        input
      };
    }
    default:
      return state;
  }
}
