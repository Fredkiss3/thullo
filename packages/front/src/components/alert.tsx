import cls from "../styles/components/alert.module.scss";
import { Icon } from "./icon";
import { useState } from "react";

export interface AlertProps {
  type?: "success" | "danger" | "warning" | "info";
}

export const Alert: React.FC<AlertProps> = ({ children, type }) => {
  const [show, setShow] = useState(true);

  return show ? (
    <div className={`${cls.alert} ${cls[`alert--${type}`] ?? ""}`}>
      <div className={cls.alert__body}>{children}</div>

      <button className={cls.alert__close_btn} onClick={() => setShow(false)}>
        <Icon icon={"x-icon"} className={cls.alert__icon} />
      </button>
    </div>
  ) : (
    <></>
  );
};
