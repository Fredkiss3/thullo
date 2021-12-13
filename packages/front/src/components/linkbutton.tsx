import { Link } from 'react-router-dom';
import cls from '../styles/components/button.module.scss';
import { ButtonVariants } from './button';

export interface LinkButtonProps {
    href: string;
    external?: boolean;
    renderIcon?: (classNames: string) => JSX.Element;
    variant?: typeof ButtonVariants[number];
}

export const LinkButton: React.FC<LinkButtonProps> = ({
    external = false,
    href,
    children,
    renderIcon,
    variant = 'outline',
}) => {
    return external ? (
        <a href={href} className={`${cls.btn} ${cls[`btn--${variant}`]}`}>
            {renderIcon && renderIcon(cls.btn__icon)}
            {children}
        </a>
    ) : (
        <Link to={href} className={`${cls.btn} ${cls[`btn--${variant}`]}`}>
            {renderIcon && renderIcon(cls.btn__icon)}
            {children}
        </Link>
    );
};
