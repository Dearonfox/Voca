import useFetch from "../hooks/useFetch";
import { useHistory } from "react-router-dom";

export default function DeleteDay() {
    const days = useFetch("http://localhost:3001/days",[]);
    const history = useHistory();
    const last = days[days.length - 1]; 


    function delDay(){
        fetch(`http://localhost:3001/days/${last.id}`, {
            method: "DELETE",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                day : days.length - 1,  
            isDone : false,
            }),
        }).then(res=> {
            if(res.ok) {
                alert("삭제 완료 되었습니다");
                history.push(`/`);
            }
        });
    }
    return (
        <div>
            <h3>현재 일수 : {days.length}일</h3>
            <button onClick={delDay}>Day 삭제</button>
        </div>
    );
}