import React, { useContext } from "react";
import Styles from "./form-status-styles.scss";
import Spinner from "../spinner/spinner";
import Context from "@/presentation/contexts/form/form-context";

const FormStatus: React.FC = () => {
  const {
    state: { isLoading, mainError },
  } = useContext(Context);
  return (
    <div role="error-wrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && <span className={Styles.error}>{mainError}</span>}
    </div>
  );
};

export default FormStatus;
