import { useEffect, useState, type SubmitEventHandler } from "react";
import styles from "./Login.module.css";
import { loginRequest } from "../../utils/loginRequest";
import { useAuth } from "../../hooks/UseAuth";
import { Navigate } from "react-router-dom";
import { apiRequest } from "../../utils/apiRequest";

interface CaptchaData {
  code: string;
  token: string;
  expires: number;
}
interface AnticsrfData {
  token: string;
  expires: number;
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
  const [loginError, setLoginError] = useState("");

  const { login, checkAuth } = useAuth();

 

  useEffect(() => {
    const getTokens = async () => {
      try {
        const [captcha, csrf] = await Promise.all([
          apiRequest<CaptchaData>(`/captcha`),
          apiRequest<AnticsrfData>(`/anticsrf`),
        ]);


        setCaptchaData(captcha);
        setAnticsrfData(csrf);
        setExpires(Math.min(csrf.expires, captcha.expires));

        setServerError(false);
        setExpired(false);
      } catch (err) {
        console.error(err);

        setCaptchaData(null);
        setAnticsrfData(null);
        setExpires(null);
        setServerError(true)
      }
    };

    getTokens();
  }, [loginError]);

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();

    if (!captchaData || !anticsrfData) {
      return;
    }

    if (expires && Date.now() / 1000 >= expires) {
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

      login(resp.token, (Date.now() + 1000 * resp.expires_in).toString());
    } catch (e: any) {
      setLoginError(e.message);
    }
  };
  if (checkAuth()) {
    return <Navigate to={"/"} replace />;
  }

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
        <p className={styles.expired}>Server Error! Please, wait.</p>
      )}
      {loginError && <p className={styles.expired}>{loginError}</p>}
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
