import{Link} from "react-router-dom";

export default function Header() {
    return (
        <div className ="header">
            <h1>
                <Link to ="/"> My Blog</Link>
            </h1>
            <div className = "Login">
                <Link to ="/Login" className ="link">
                    로그인
                </Link>
                <Link to="/SignUp" className ="link">
                    회원가입
                </Link>
            </div>
        </div>
    )
}