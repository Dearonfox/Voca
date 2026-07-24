import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";
import { DayItem, WordItem } from "../types";
import Word from "./Word";

type FilterMode = "all" | "active" | "done";

export default function Day() {
  const { day } = useParams<{ day: string }>();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const {
    data: days,
    isLoading: isDaysLoading,
    error: daysError,
  } = useFetch<DayItem[]>(apiUrl("/days"), []);
  const {
    data: fetchedWords,
    isLoading: isWordsLoading,
    error: wordsError,
  } = useFetch<WordItem[]>(apiUrl(`/words?day=${day}`), []);
  const [words, setWords] = useState<WordItem[]>([]);

  useEffect(() => {
    setWords(fetchedWords);
  }, [fetchedWords]);

  const sortedDays = useMemo(
    () => [...days].sort((a, b) => a.day - b.day),
    [days]
  );

  if (isDaysLoading || isWordsLoading) {
    return <p className="center muted">학습 데이터를 불러오는 중...</p>;
  }

  if (daysError || wordsError) {
    return <p className="center muted">데이터를 불러오지 못했습니다. 서버 상태를 확인해 주세요.</p>;
  }

  const idx = sortedDays.findIndex((d) => d.day === Number(day));
  if (idx === -1) return <p className="center muted">존재하지 않는 Day입니다.</p>;

  const prevDay = idx > 0 ? sortedDays[idx - 1].day : null;
  const nextDay = idx < sortedDays.length - 1 ? sortedDays[idx + 1].day : null;
  const doneCount = words.filter((word) => word.isDone).length;
  const progress = words.length ? Math.round((doneCount / words.length) * 100) : 0;
  const remainingCount = words.length - doneCount;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredWords = words.filter((word) => {
    const matchesQuery =
      !normalizedQuery ||
      word.eng.toLowerCase().includes(normalizedQuery) ||
      word.kor.toLowerCase().includes(normalizedQuery);
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !word.isDone) ||
      (filter === "done" && word.isDone);

    return matchesQuery && matchesFilter;
  });

  function handleDelete(id: string) {
    setWords((current) => current.filter((word) => word.id !== id));
  }

  function handleUpdate(updatedWord: WordItem) {
    setWords((current) =>
      current.map((word) => (word.id === updatedWord.id ? updatedWord : word))
    );
  }

  return (
    <div className="day-page">
      <section className="day-overview">
        <div>
          <p className="eyebrow">WORD TRAINING</p>
          <h2>Day {day}</h2>
          <p className="muted">
            {doneCount}/{words.length} 단어 완료 · {remainingCount}개 남음
          </p>
          <Link className="day-add-link" to={`/create_word?day=${day}`}>
            이 Day에 단어 추가
          </Link>
        </div>
        <div className="day-progress">
          <strong>{progress}%</strong>
          <span className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </span>
        </div>
      </section>

      <div className="day-nav">
        {prevDay ? (
          <Link className="arrow" to={`/day/${prevDay}`}>
            {"<"}
          </Link>
        ) : (
          <span />
        )}
        <Link className="back-link" to="/">
          전체 Day
        </Link>
        {nextDay ? (
          <Link className="arrow" to={`/day/${nextDay}`}>
            {">"}
          </Link>
        ) : (
          <span />
        )}
      </div>

      <section className="word-toolbar" aria-label="단어 목록 도구">
        <label className="search-box">
          <span>단어 검색</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="영어 또는 뜻 검색"
          />
        </label>
        <div className="filter-tabs" aria-label="암기 상태 필터">
          <button
            className={filter === "all" ? "is-active" : ""}
            onClick={() => setFilter("all")}
          >
            전체
          </button>
          <button
            className={filter === "active" ? "is-active" : ""}
            onClick={() => setFilter("active")}
          >
            미완료
          </button>
          <button
            className={filter === "done" ? "is-active" : ""}
            onClick={() => setFilter("done")}
          >
            완료
          </button>
        </div>
      </section>

      {filteredWords.length ? (
        <table className="word-table">
          <tbody>
            {filteredWords.map((word) => (
              <Word
                key={word.id}
                word={word}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <section className="empty-state">
          <p className="eyebrow">EMPTY SET</p>
          <h3>{words.length ? "조건에 맞는 단어가 없습니다." : "아직 단어가 없습니다."}</h3>
          <p>
            {words.length
              ? "검색어나 필터를 바꿔 다시 확인해 보세요."
              : "이 Day에 첫 단어를 추가해서 학습 세트를 시작하세요."}
          </p>
          {!words.length && (
            <Link className="hero-cta" to={`/create_word?day=${day}`}>
              첫 단어 추가
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
