import React, { SetStateAction, useState } from "react";

interface UseSearchBar {
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
}

const useSearchBar = (): UseSearchBar => {
  const [value, setValue] = useState<string>("");

  return {
    value,
    setValue,
  };
};

export default useSearchBar;
