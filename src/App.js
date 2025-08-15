import DayList from "./component/DayList";
import Header from "./component/Header";
import Day from "./component/Day"
import { useState } from 'react';
function App() {
 
  return (
    <div className ="App">
      <Header />
      <DayList />
      <Day />
    </div>
);
}

export default App;
