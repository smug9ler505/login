import { apiRequest } from "./apiRequest";

interface Args {
  username: string;
  password: string;
  captchaToken: string;
  captchaValue: string;
  csrfToken: string;
}
interface LoginResponse {
  expires_in: number;
  ok: 1 | 0;
  token: string;
}
export const loginRequest = async ({
  username,
  password,
  captchaToken,
  captchaValue,
  csrfToken,
}: Args) => {
  const resp = await apiRequest<LoginResponse>(`/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      captcha: captchaValue,
      captcha_token: captchaToken,
      anticsrf: csrfToken,
    }),
  });

  return resp;
};
