export const useLocalStorage = <TValue>(key: string) => {
  const get = (): TValue | null => {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value) as TValue;
    return null;
  }

  return {
    set: (value: TValue) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get,
    value: get()
  }
}