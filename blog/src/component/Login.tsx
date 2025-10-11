import{Link} from "react-router-dom";

export default function Login(){
    return(
        <div className="login">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="사용자 이름" />
                <input type="password" placeholder="비밀번호" />
                <button>로그인</button>
            </form>
            <button className="registerButton">
                <Link className="link" to="/register">회원가입</Link>
            </button>
        </div>
    )
}