import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";
import { WordItem } from "../types";

type TestResult = {
  word: WordItem;
  answer: string;
  isCorrect: boolean;
};

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "");
}

function getAcceptedAnswers(kor: string) {
  return kor
    .split(/[,;|/、，]/)
    .map(normalizeAnswer)
    .filter(Boolean);
}

function shuffleWords(words: WordItem[]) {
  return [...words].sort(() => Math.random() - 0.5);
}

export default function PaperTest() {
  const { day } = useParams<{ day: string }>();
  const {
    data: fetchedWords,
    isLoading,
    error,
  } = useFetch<WordItem[]>(apiUrl(`/words?day=${day}`), []);
  const [testWords, setTestWords] = useState<WordItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<TestResult[] | null>(null);

  const score = useMemo(
    () => results?.filter((result) => result.isCorrect).length || 0,
    [results]
  );

  useEffect(() => {
    const unfinishedWords = fetchedWords.filter((word) => !word.isDone);

    if (!unfinishedWords.length) {
      setTestWords([]);
      setAnswers({});
      setResults(null);
      return;
    }

    const pickedWords = shuffleWords(unfinishedWords).slice(0, 20);
    setTestWords(pickedWords);
    setAnswers({});
    setResults(null);
  }, [fetchedWords]);

  function updateAnswer(wordId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [wordId]: value,
    }));
  }

  function gradeTest(e: FormEvent) {
    e.preventDefault();

    const gradedResults = testWords.map((word) => {
      const answer = answers[word.id] || "";
      const acceptedAnswers = getAcceptedAnswers(word.kor);
      const normalizedAnswer = normalizeAnswer(answer);

      return {
        word,
        answer,
        isCorrect: acceptedAnswers.includes(normalizedAnswer),
      };
    });

    setResults(gradedResults);
  }

  function resetTest() {
    const unfinishedWords = fetchedWords.filter((word) => !word.isDone);

    setTestWords(shuffleWords(unfinishedWords).slice(0, 20));
    setAnswers({});
    setResults(null);
  }

  if (isLoading) {
    return <p className="center muted">쪽지시험을 준비하는 중...</p>;
  }

  if (error) {
    return <p className="center muted">단어를 불러오지 못했습니다.</p>;
  }

  if (!testWords.length) {
    return (
      <section className="paper-test-card">
        <p className="eyebrow">PAPER TEST</p>
        <h2>Day {day} 쪽지시험</h2>
        <p className="muted">시험 볼 미완료 단어가 없습니다.</p>
        <Link className="hero-cta" to={`/day/${day}`}>
          Day로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className="paper-test-card">
      <div className="paper-test-head">
        <div>
          <p className="eyebrow">PAPER TEST</p>
          <h2>Day {day} 쪽지시험</h2>
          <p className="muted">영어 단어를 보고 한국어 뜻을 적어 보세요.</p>
        </div>
        <strong>
          {results ? `${score}/${testWords.length}` : `${testWords.length}문제`}
        </strong>
      </div>

      <form className="paper-test-form" onSubmit={gradeTest}>
        <div className="paper-test-list">
          {testWords.map((word, index) => {
            const result = results?.find((item) => item.word.id === word.id);

            return (
              <label
                key={word.id}
                className={`paper-test-row ${
                  result ? (result.isCorrect ? "is-correct" : "is-wrong") : ""
                }`}
              >
                <span className="paper-test-number">{index + 1}</span>
                <strong>{word.eng}</strong>
                <input
                  value={answers[word.id] || ""}
                  onChange={(e) => updateAnswer(word.id, e.target.value)}
                  placeholder="뜻 입력"
                  disabled={Boolean(results)}
                />
                {result && (
                  <em>
                    {result.isCorrect ? "정답" : `정답: ${word.kor}`}
                  </em>
                )}
              </label>
            );
          })}
        </div>

        <div className="paper-test-actions">
          {!results ? (
            <button type="submit">채점하기</button>
          ) : (
            <button type="button" onClick={resetTest}>
              다시 출제
            </button>
          )}
          <Link className="form-day-link" to={`/day/${day}`}>
            Day로 돌아가기
          </Link>
        </div>
      </form>
    </section>
  );
}
