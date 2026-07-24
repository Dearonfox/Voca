import { useState } from "react";
import { apiUrl } from "../api";
import { WordItem } from "../types";

interface WordProps {
  word: WordItem;
  onDelete: (id: string) => void;
  onUpdate: (word: WordItem) => void;
}

export default function Word({ word, onDelete, onUpdate }: WordProps) {
  const [isShow, setIsShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function toggleShow() {
    setIsShow(!isShow);
  }

  function toggleDone() {
    const updatedWord = { ...word, isDone: !word.isDone };
    setIsSaving(true);

    fetch(apiUrl(`/words/${word.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWord),
    })
      .then((res) => {
        if (!res.ok) throw new Error("상태 변경에 실패했습니다.");
        onUpdate(updatedWord);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  function del() {
    if (!window.confirm(`${word.eng} 단어를 삭제할까요?`)) {
      return;
    }

    setIsSaving(true);

    fetch(apiUrl(`/words/${word.id}`), {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제에 실패했습니다.");
        onDelete(word.id);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  return (
    <tr className={word.isDone ? "off" : ""}>
      <td>
        <input
          aria-label={`${word.eng} 암기 완료`}
          type="checkbox"
          checked={word.isDone}
          disabled={isSaving}
          onChange={toggleDone}
        />
      </td>
      <td>
        <span className="word-eng">{word.eng}</span>
      </td>
      <td>
        <span className={isShow ? "word-kor is-visible" : "word-kor"}>
          {isShow ? word.kor : "뜻 숨김"}
        </span>
      </td>
      <td>
        <button className="btn_soft" onClick={toggleShow} disabled={isSaving}>
          {isShow ? "숨기기" : "뜻 보기"}
        </button>
        <button onClick={del} className="btn_del" disabled={isSaving}>
          삭제
        </button>
      </td>
    </tr>
  );
}
