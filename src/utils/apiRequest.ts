export const apiRequest = async <T>(url: string, options?: {}): Promise<T> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE}` + url,
    options,
  ).then((val) => val.json());

  if (!res.ok) {
    console.log(res);
    throw new Error(`Request failed: ${res.error}`);
  }
  return res;
};
