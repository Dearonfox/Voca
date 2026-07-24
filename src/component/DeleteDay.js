import { useHistory } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";

export default function DeleteDay() {
  const { data: days, isLoading, error } = useFetch(apiUrl("/days"), []);
  const history = useHistory();
  const sortedDays = [...days].sort((a, b) => a.day - b.day);
  const last = sortedDays[sortedDays.length - 1];

  function delDay() {
    if (!last) return;

    if (!window.confirm(`Day ${last.day}와 해당 Day의 단어를 함께 삭제할까요?`)) {
      return;
    }

    fetch(apiUrl(`/words?day=${last.day}`))
      .then((res) => {
        if (!res.ok) throw new Error("단어 목록을 확인하지 못했습니다.");
        return res.json();
      })
      .then((words) =>
        Promise.all(
          words.map((word) =>
            fetch(apiUrl(`/words/${word.id}`), {
              method: "DELETE",
            })
          )
        )
      )
      .then(() =>
        fetch(apiUrl(`/days/${last.id}`), {
          method: "DELETE",
        })
      )
      .then((res) => {
        if (!res.ok) throw new Error("Day 삭제에 실패했습니다.");

        alert(`Day ${last.day}가 삭제되었습니다.`);
        history.push("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  if (isLoading) return <p className="center muted">Day 목록을 불러오는 중...</p>;
  if (error) return <p className="center muted">Day 목록을 불러오지 못했습니다.</p>;

  return (
    <section className="manage-card danger-zone">
      <p className="eyebrow">DANGER ZONE</p>
      <h2>마지막 Day 삭제</h2>
      <p className="muted">
        {last
          ? `Day ${last.day}와 연결된 단어를 함께 삭제합니다.`
          : "삭제할 Day가 없습니다."}
      </p>
      <button onClick={delDay} disabled={!last} className="btn_del">
        Day 삭제
      </button>
    </section>
  );
}
