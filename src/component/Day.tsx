import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Word, {IWord} from "./Word"; 
import React, { useRef, useState, FormEvent } from "react";

export default function Day() {
  const { day } = useParams<{day : string}>();
  const days = useFetch<Array<{ id: number; day: number }>>("http://localhost:3001/days",[]);
  const words = useFetch<IWord[]>(`http://localhost:3001/words?day=${day}`,[]);
  
  if (!days.length) return <div>Loading...</div>;

  const idx = days.findIndex(d => d.day === Number(day));
  const prevDay = idx > 0 ? days[idx - 1].day : null;
  const nextDay = idx < days.length - 1 ? days[idx + 1].day : null;

  return (
    <div className="day-page">
      <h2 className="day-title">
        {prevDay && <Link className="arrow" to={`/day/${prevDay}`}>◀</Link>}
        Day {day}
        {nextDay && <Link className="arrow" to={`/day/${nextDay}`}>▶</Link>}
      </h2>

      <table className="word-table">
        <tbody>
          {words.map(w => (
            <Word key={w.id} word={w} />
          ))}
          {!words.length && (
            <tr>
              <td colSpan={4}>단어가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}