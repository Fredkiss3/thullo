import cls from '../styles/components/alert.module.scss';
import { Icon } from './icon';

export interface AlertProps {
    type?: 'success' | 'danger' | 'warning' | 'info';
    onClose?: () => void;
}

export function Alert({ children, type, onClose }: AlertProps) {
    const leftIcon = type === 'danger' && 'x-circle';

    return (
        <div className={`${cls.alert} ${cls[`alert--${type}`] ?? ''}`}>
            {/*@ts-ignore*/}
            <Icon icon={leftIcon} className={cls.alert__icon_left} />
            <div className={cls.alert__body}>{children}</div>

            <button
                className={cls.alert__close_btn}
                onClick={() => onClose && onClose()}
            >
                <Icon icon={'x-icon'} className={cls.alert__icon_right} />
            </button>
        </div>
    );
}
