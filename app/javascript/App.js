import React from 'react';
import { Provider } from 'react-redux';

import store from 'store';
import TaskBoard from 'containers/TaskBoard';

function App() {
  return (
    <Provider store={store}>
      <TaskBoard />
    </Provider>
  );
}

export default App;
