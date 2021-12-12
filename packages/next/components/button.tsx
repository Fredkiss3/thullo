import cls from "../styles/components/button.module.scss";

export const ButtonVariants = [
  "primary",
  "outline",
  "hollow",
  "black",
  "danger",
] as const;

export const ButtonSizes = ["small", "medium", "large"] as const;

export interface ButtonProps {
  variant?: typeof ButtonVariants[number];
  disabled?: boolean;
  renderIcon?: (classNames: string) => JSX.Element;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  disabled,
  renderIcon,
}) => {
  return (
    <button
      className={`${cls.btn} ${cls[`btn--${variant}`]} ${
        disabled && cls["btn--disabled"]
      }`}
    >
      {renderIcon && renderIcon(cls.btn__icon)}
      {children}
    </button>
  );
};
