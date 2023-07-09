import { useState } from "react";

export default function useInput(initialValue: string) {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
    setError(false);
  }

  function reset() {
    setValue(initialValue);
    setError(false);
  }

  const res = {
    value: {
      value,
      setValue,
      handleChange,
    },
    error: {
      value: error,
      setError,
    },
    reset,
  };

  return res;
}
