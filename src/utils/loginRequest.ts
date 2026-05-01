interface Args {
  username: string;
  password: string;
  captchaToken: string;
  captchaValue: string;
  csrfToken: string;
}
export const loginRequest = async ({
  username,
  password,
  captchaToken,
  captchaValue,
  csrfToken,
}: Args) => {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      captcha: captchaValue,
      captcha_token: captchaToken,
      anticsrf: csrfToken,
    }),
  }).then(val => val.json());

  return resp;
};
