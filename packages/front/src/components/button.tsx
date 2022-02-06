import cls from '../styles/components/button.module.scss';

export const ButtonVariants = [
    'primary',
    'outline',
    'hollow',
    'black',
    'danger',
] as const;

export const ButtonSizes = ['small', 'medium', 'large'] as const;

export interface ButtonProps {
    variant?: typeof ButtonVariants[number];
    disabled?: boolean;
    renderIcon?: (classNames: string) => JSX.Element;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
    size?: typeof ButtonSizes[number];
    isStatic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant,
    disabled,
    renderIcon,
    onClick,
    className,
    size,
    isStatic = false,
}) => {
    return (
        <button
            onClick={onClick}
            className={`
                    ${cls.btn} 
                    ${cls[`btn--${variant}`]} 
                    ${cls[`btn--${size}`]}
                    ${disabled && cls['btn--disabled']}
                    ${className ?? ''}
                    ${isStatic && cls['btn--static']}
            `}
        >
            {renderIcon && renderIcon(cls.btn__icon)}
            {children}
        </button>
    );
};
