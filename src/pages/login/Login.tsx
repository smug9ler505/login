import { useEffect, useState, type SubmitEventHandler } from "react";
import styles from "./Login.module.css";
import { loginRequest } from "../../utils/loginRequest";
import { useAuth } from "../../hooks/UseAuth";
import { useNavigate } from "react-router-dom";

interface CaptchaData {
  code: string;
  token: string;
}
interface AnticsrfData {
  token: string;
}

export const Login = () => {
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [anticsrfData, setAnticsrfData] = useState<AnticsrfData | null>(null);
  const [expires, setExpires] = useState<number | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  
  const [serverError, setServerError] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loginError, setLoginError] = useState('')

  const { login, checkAuth } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
  if (checkAuth()) {
    navigate('/', {replace: true})
  }
}, []);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/captcha`).then((val) =>
            val.json(),
          ),
          fetch(`${import.meta.env.VITE_API_BASE}/anticsrf`).then((val) =>
            val.json(),
          ),
        ]);

        setCaptchaData(responses[0]);
        setAnticsrfData(responses[1]);
        setExpires(Math.min(+responses[0].expires, +responses[1].expires));
      } catch (e) {
        console.log(e);
        setServerError(true);
      }
    };
    getTokens();
  }, []);

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();

    if (!captchaData || !anticsrfData) {
      return;
    }

    if (expires && Date.now() >= Number(new Date(expires * 1000))) {
      setExpired(true);

      return;
    }
    try {
      const resp = await loginRequest({
        username,
        password,
        captchaValue,
        captchaToken: captchaData.token,
        csrfToken: anticsrfData.token,
      });
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      login(resp.token, resp.expires);
    } catch (e: any) {
      setLoginError(e.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Username"
        required
        className={styles.input}
      />

      <input
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
        className={styles.input}
      />

      <label className={styles.labelCaptcha}>
        <div className={styles.captcha}>{captchaData?.code ?? "------"}</div>
        <input
          name="captcha"
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
          type="text"
          className={styles.inputCaptcha}
          placeholder="Type the text above"
          required
        />
      </label>
      {expired && (
        <p className={styles.expired}>
          Session Expired. Please, refresh the page.
        </p>
      )}
      {serverError && (
        <p className={styles.expired}>
          Server Error! Please, refresh the page and try again
        </p>
      )}
      {loginError && (
        <p className={styles.expired}>
          {loginError}
        </p>
      )}
      <button
        type="submit"
        className={styles.button}
        disabled={expired || serverError}
      >
        Login
      </button>
    </form>
  );
};
