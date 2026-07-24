import { Link } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";
import { DayItem, WordItem } from "../types";

function getDayProgress(words: WordItem[]) {
  const done = words.filter((word) => word.isDone).length;
  const progress = words.length ? Math.round((done / words.length) * 100) : 0;

  return { done, progress };
}

export default function Daylist() {
  const {
    data: days,
    isLoading: isDaysLoading,
    error: daysError,
  } = useFetch<DayItem[]>(apiUrl("/days"), []);
  const {
    data: words,
    isLoading: isWordsLoading,
    error: wordsError,
  } = useFetch<WordItem[]>(apiUrl("/words"), []);

  if (isDaysLoading || isWordsLoading) {
    return <p className="center muted">학습 데이터를 불러오는 중...</p>;
  }

  if (daysError || wordsError) {
    return <p className="center muted">데이터를 불러오지 못했습니다. 서버 상태를 확인해 주세요.</p>;
  }

  const completedWords = words.filter((word) => word.isDone).length;
  const progress = words.length
    ? Math.round((completedWords / words.length) * 100)
    : 0;
  const sortedDays = [...days].sort((a, b) => a.day - b.day);
  const recommendedDay =
    sortedDays.find((day) => {
      const dayWords = words.filter((word) => Number(word.day) === day.day);
      return getDayProgress(dayWords).progress < 100;
    }) || sortedDays[0];
  const recommendedDayNumber = recommendedDay?.day || 1;

  return (
    <>
      <section className="study-hero" aria-label="학습 요약">
        <div>
          <p className="eyebrow">ENGLISH LITERATURE TO TOEIC VOCA</p>
          <h2>문맥으로 보고, 반복으로 외우는 단어 루틴</h2>
          <p className="hero-copy">
            영문학 전공자의 언어 감각을 살려 Day별 단어를 정리했습니다. 외운 단어는 체크하고, 부족한 Day부터 이어서 학습하세요.
          </p>
          <Link to={`/day/${recommendedDayNumber}`} className="hero-cta">
            추천 Day 학습하기
          </Link>
        </div>
        <div className="score-card">
          <span className="score-label">전체 학습률</span>
          <strong>{progress}%</strong>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            {completedWords} / {words.length} 단어 완료
          </p>
        </div>
      </section>

      <section className="summary-grid" aria-label="학습 지표">
        <div>
          <span>학습 세트</span>
          <strong>{days.length}</strong>
        </div>
        <div>
          <span>전체 단어</span>
          <strong>{words.length}</strong>
        </div>
        <div>
          <span>남은 단어</span>
          <strong>{words.length - completedWords}</strong>
        </div>
      </section>

      <div className="section-title">
        <div>
          <p className="eyebrow">DAY CURRICULUM</p>
          <h3>학습 Day</h3>
        </div>
        <Link to="/create_day" className="text-link">
          Day 추가
        </Link>
      </div>

      <ul className="list_day">
        {sortedDays.map((day) => {
          const dayWords = words.filter((word) => Number(word.day) === day.day);
          const { done, progress: dayProgress } = getDayProgress(dayWords);

          return (
            <li key={day.id}>
              <Link to={`/day/${day.day}`}>
                <span className="day-card-label">Daily set</span>
                <strong>Day {day.day}</strong>
                <span className="day-card-meta">
                  {done}/{dayWords.length} words
                </span>
                <span className="mini-progress">
                  <span style={{ width: `${dayProgress}%` }} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
