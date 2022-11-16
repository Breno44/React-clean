import React, { useContext, useRef } from "react";
import Styles from "./input-styles.scss";
import Context from "@/presentation/contexts/form/form-context";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context);
  const error = state[`${props.name}Error`];
  const inputRef = useRef<HTMLInputElement>();

  return (
    <div
      role={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? "invalid" : "valid"}
    >
      <input
        {...props}
        ref={inputRef}
        title={error}
        placeholder=" "
        role={props.name}
        readOnly
        onFocus={(e) => {
          e.target.readOnly = false;
        }}
        onChange={(e) => {
          setState({
            ...state,
            [e.target.name]: e.target.value,
          });
        }}
      />
      <label
        title={error}
        role={`${props.name}-label`}
        onClick={(_) => {
          inputRef.current.focus();
        }}
      >
        {props.placeholder}
      </label>
    </div>
  );
};

export default Input;
