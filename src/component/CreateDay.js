import { useHistory } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";

export default function CreateDay() {
  const { data: days, isLoading, error } = useFetch(apiUrl("/days"), []);
  const history = useHistory();

  function addDay() {
    const nextDay = days.length ? Math.max(...days.map((day) => day.day)) + 1 : 1;

    fetch(apiUrl("/days"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: nextDay,
      }),
    }).then((res) => {
      if (res.ok) {
        alert(`Day ${nextDay}가 추가되었습니다.`);
        history.push(`/day/${nextDay}`);
      }
    });
  }

  if (isLoading) return <p className="center muted">Day 목록을 불러오는 중...</p>;
  if (error) return <p className="center muted">Day 목록을 불러오지 못했습니다.</p>;

  return (
    <section className="manage-card">
      <p className="eyebrow">CURRICULUM</p>
      <h2>새 Day 추가</h2>
      <p className="muted">
        현재 {days.length}개의 Day가 있습니다. 다음 Day를 추가하면 바로 단어를 입력할 수 있습니다.
      </p>
      <button onClick={addDay}>Day {days.length ? Math.max(...days.map((day) => day.day)) + 1 : 1} 추가</button>
    </section>
  );
}
