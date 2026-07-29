import { FormEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../api";
import useFetch from "../hooks/useFetch";
import { WordItem } from "../types";

type QuizResult = "idle" | "correct" | "wrong";

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "");
}

function getAcceptedAnswers(kor: string) {
  return kor
    .split(/[,，/;|]/)
    .map(normalizeAnswer)
    .filter(Boolean);
}

export default function WordQuiz() {
  const { day } = useParams<{ day: string }>();
  const {
    data: fetchedWords,
    isLoading,
    error,
  } = useFetch<WordItem[]>(apiUrl(`/words?day=${day}`), []);
  const quizWords = useMemo(
    () => fetchedWords.filter((word) => !word.isDone),
    [fetchedWords]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<QuizResult>("idle");
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentWord = quizWords[currentIndex];
  const isFinished = !currentWord && quizWords.length > 0;

  async function markDone(word: WordItem) {
    const updatedWord = { ...word, isDone: true };

    const res = await fetch(apiUrl(`/words/${word.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWord),
    });

    if (!res.ok) {
      throw new Error("완료 처리에 실패했습니다.");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!currentWord || isSaving || result !== "idle") {
      return;
    }

    const normalizedUserAnswer = normalizeAnswer(answer);
    const acceptedAnswers = getAcceptedAnswers(currentWord.kor);
    const isCorrect = acceptedAnswers.includes(normalizedUserAnswer);

    if (isCorrect) {
      setIsSaving(true);
      try {
        await markDone(currentWord);
        setScore((current) => current + 1);
        setResult("correct");
      } catch (err) {
        alert(err instanceof Error ? err.message : "채점 저장에 실패했습니다.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setResult("wrong");
  }

  function moveNext() {
    setAnswer("");
    setResult("idle");
    setCurrentIndex((current) => current + 1);
  }

  if (isLoading) return <p className="center muted">시험지를 만드는 중...</p>;
  if (error) return <p className="center muted">단어를 불러오지 못했습니다.</p>;

  if (!quizWords.length) {
    return (
      <section className="quiz-card">
        <p className="eyebrow">QUIZ</p>
        <h2>Day {day} 시험</h2>
        <p className="muted">미완료 단어가 없습니다. 오늘 학습은 전부 완료됐어요.</p>
        <Link className="hero-cta" to={`/day/${day}`}>
          Day로 돌아가기
        </Link>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section className="quiz-card">
        <p className="eyebrow">RESULT</p>
        <h2>시험 완료</h2>
        <p className="quiz-score">
          {score}/{quizWords.length}
        </p>
        <p className="muted">
          맞춘 단어는 완료 처리했습니다. 틀린 단어는 Day에 남겨두었어요.
        </p>
        <Link className="hero-cta" to={`/day/${day}`}>
          결과 확인하기
        </Link>
      </section>
    );
  }

  return (
    <section className="quiz-card">
      <div className="quiz-head">
        <div>
          <p className="eyebrow">QUIZ MODE</p>
          <h2>Day {day} 시험</h2>
        </div>
        <span>
          {currentIndex + 1}/{quizWords.length}
        </span>
      </div>

      <div className="quiz-word">
        <span>English word</span>
        <strong>{currentWord.eng}</strong>
      </div>

      <form className="quiz-form" onSubmit={onSubmit}>
        <label>
          <span>한글 뜻</span>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="뜻을 입력하세요"
            disabled={result !== "idle" || isSaving}
            autoFocus
          />
        </label>
        <button disabled={!answer.trim() || result !== "idle" || isSaving}>
          {isSaving ? "채점 중..." : "정답 확인"}
        </button>
      </form>

      {result === "correct" && (
        <div className="quiz-feedback is-correct">
          <strong>정답입니다.</strong>
          <p>이 단어는 완료 처리했어요.</p>
        </div>
      )}

      {result === "wrong" && (
        <div className="quiz-feedback is-wrong">
          <strong>아쉽습니다.</strong>
          <p>정답: {currentWord.kor}</p>
        </div>
      )}

      {result !== "idle" && (
        <button className="btn_soft quiz-next" onClick={moveNext}>
          다음 문제
        </button>
      )}

      <Link className="text-link quiz-back" to={`/day/${day}`}>
        시험 나가기
      </Link>
    </section>
  );
}
