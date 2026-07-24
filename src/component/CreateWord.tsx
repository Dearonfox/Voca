import { FormEvent, useMemo, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";
import { DayItem } from "../types";

export default function CreateWord() {
  const { data: days, isLoading, error } = useFetch<DayItem[]>(
    apiUrl("/days"),
    []
  );
  const history = useHistory();
  const location = useLocation();
  const presetDay = new URLSearchParams(location.search).get("day");
  const [isSaving, setIsSaving] = useState(false);

  const engRef = useRef<HTMLInputElement>(null);
  const korRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLSelectElement>(null);
  const sortedDays = useMemo(
    () => [...days].sort((a, b) => a.day - b.day),
    [days]
  );
  const selectedDay = presetDay || String(sortedDays[0]?.day || "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (isSaving || !dayRef.current || !engRef.current || !korRef.current) {
      return;
    }

    const day = Number(presetDay || dayRef.current.value);
    const eng = engRef.current.value.trim();
    const kor = korRef.current.value.trim();

    if (!eng || !kor) {
      alert("영어 단어와 뜻을 모두 입력해 주세요.");
      return;
    }

    setIsSaving(true);

    fetch(apiUrl("/words"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day,
        eng,
        kor,
        isDone: false,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("단어 생성에 실패했습니다.");

        alert("단어가 추가되었습니다.");
        history.push(`/day/${day}`);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  if (isLoading) return <p className="center muted">Day 목록을 불러오는 중...</p>;
  if (error) return <p className="center muted">Day 목록을 불러오지 못했습니다.</p>;

  return (
    <form className="word-form" onSubmit={onSubmit}>
      <div className="form-head">
        <p className="eyebrow">ADD WORD</p>
        <h2>{presetDay ? `Day ${presetDay} 단어 추가` : "단어 추가"}</h2>
        <p className="muted">
          영어 단어와 한국어 뜻을 입력하면 해당 Day 학습 세트에 바로 반영됩니다.
        </p>
        {presetDay && (
          <Link to={`/day/${presetDay}`} className="form-close">
            돌아가기
          </Link>
        )}
      </div>
      <div className="input_area">
        <label>English word</label>
        <input type="text" placeholder="computer" ref={engRef} />
      </div>
      <div className="input_area">
        <label>Korean meaning</label>
        <input type="text" placeholder="컴퓨터" ref={korRef} />
      </div>
      <div className="input_area">
        <label>Day</label>
        <select ref={dayRef} defaultValue={selectedDay} disabled={Boolean(presetDay)}>
          {sortedDays.map((day) => (
            <option key={day.id} value={day.day}>
              Day {day.day}
            </option>
          ))}
        </select>
      </div>
      <button disabled={isSaving}>{isSaving ? "저장 중..." : "단어 저장"}</button>
    </form>
  );
}
