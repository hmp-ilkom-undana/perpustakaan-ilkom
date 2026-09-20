import * as React from "react";
import { Input, type InputProps } from "./input";

export interface CurrencyInputProps
  extends Omit<InputProps, "value" | "onChange"> {
  value: number;
  onValueChange: (value: number) => void;
}

export function CurrencyInput({
  value,
  onValueChange,
  className,
  onFocus,
  onBlur,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(() =>
    value ? new Intl.NumberFormat("id-ID").format(value) : value === 0 ? "0" : ""
  );
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(
        value ? new Intl.NumberFormat("id-ID").format(value) : value === 0 ? "0" : ""
      );
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDisplayValue("");
      onValueChange(0);
      return;
    }
    const parsed = parseInt(raw, 10);
    setDisplayValue(new Intl.NumberFormat("id-ID").format(parsed));
    onValueChange(parsed);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (!displayValue || displayValue.trim() === "") {
      setDisplayValue("0");
      onValueChange(0);
    }
    onBlur?.(e);
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      {...props}
    />
  );
}
