import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const dayMatch = pathname.match(/^\/day\/(\d+)$/);
  const createWordPath = dayMatch
    ? `/create_word?day=${dayMatch[1]}`
    : "/create_word";

  return (
    <header className="header">
      <h1>
        <Link to="/">
          <span className="brand-mark">V</span>
          Voca
        </Link>
      </h1>
      <nav className="menu" aria-label="주요 메뉴">
        <Link to={createWordPath} className="link link-primary">
          단어 추가
        </Link>
        <Link to="/create_day" className="link">
          Day 추가
        </Link>
        <Link to="/delete_day" className="link link-danger">
          Day 삭제
        </Link>
      </nav>
    </header>
  );
}
