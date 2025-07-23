import './App.css';
import { useState } from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "./component/Header"

function App() {
  let post = '강남'
  let [옷, setName] = useState(['남자 OOTD 추천','여자 OOTD 추천','신발 추천'])
  let [좋아요, setGood] = useState(0)
  let [싫어요, setBad] = useState(0); 
  let [나이, set나이] = useState(null);
  

  function addsetGood(){
    setGood(좋아요 +1);
  }
  function addsetBad(){
    setBad(싫어요 +1);
  }
  function showAge(age) {
    set나이(age); // 화면에 보여줄 수 있게 state 변경
  }
  function changeFirstTitle() {
    const copy = [...옷];
    copy[0] = copy[0] === '여자 ootd 추천' ? '남자 코트 추천' : '여자 코트 추천';
    setName(copy);
  }
  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <div className="list">
        <h4>
          {옷[0]} <span onClick = {addsetGood}>👍</span> {좋아요} {/* <span onClick ={()=>{setGood(좋아요 +1)}} 과 동일*/}
          <span onClick ={addsetBad}>😒{싫어요}</span>
        </h4> 
        <button onClick={changeFirstTitle}>Change</button><p></p>
      </div>

      <div className="list">
        <h4>{옷[[1]]}</h4>
        <button onClick ={() => {showAge(30)}}>Show age</button>
        <p>{나이}</p>        
      </div>
      <div className="list">
        <h4>{옷[2]}</h4>
        <p>2월 17일 발행</p>
      </div>
  </div>
  </BrowserRouter>
);
}

export default App;
