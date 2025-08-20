import React, { useRef, useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { IDay } from "./DayList";
export default function CreateWord() {
    const days : IDay[] =  useFetch("http://localhost:3001/days",[])
    const history  = useHistory();
    const [isLoading,setIsLoading] = useState(false);

    const engRef = useRef<HTMLInputElement>(null);
    const korRef = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLSelectElement>(null);

    function onSubmit(e : React.FormEvent) {
        e.preventDefault();
    
        if (!isLoading && dayRef.current && engRef.current && korRef.current) {
            setIsLoading(true);

            const day = dayRef.current.value;
            const eng = engRef.current.value;
            const kor = korRef.current.value;

    fetch(`http://localhost:3001/words/`, {
        method: "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({
            day : dayRef.current.value,
            eng : engRef.current.value,
            kor : korRef.current.value,
        isDone : false,
        }),
    }).then(res=> {
        if(res.ok) {
            alert("생성이 완료 되었습니다");
            history.push(`/day/${day}`);
        }
    });
    }
}

    return (
        <form onSubmit={onSubmit}>
            <div className="input_area"> 
                <label>Eng</label>
                <input type ="text" placeholder="computer" ref={(engRef)}/>
            </div>
            <div className="input_area">
                <label>Kor</label>
                <input type ="text" placeholder="컴퓨터" ref={(korRef)}/>
            </div>   
             <div className="input_area">
                <label>Day</label>
                <select ref={(dayRef)}>
                    {days.map(day => (
                        <option key = {day.id} value ={day.day}>
                            {day.day}
                        </option>
                    ))}
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </div>     
            <button>저장</button>
            </form>
        );         
}