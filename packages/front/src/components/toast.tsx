import * as React from 'react';
import { Transition } from '@headlessui/react';

// functions & Others
import { ToastType } from '@/lib/types';

// Components
import { Icon } from '@/components/icon';

// Styles
import cls from '@/styles/components/toast.module.scss';

export interface ToastProps {
    onClose: () => void;
    type?: ToastType;
    duration?: number;
    children: React.ReactNode;
    keep?: boolean;
    closeable?: boolean;
}

export function Toast({
    children,
    onClose,
    duration = 5000,
    keep = false,
    type = 'success',
    closeable = true,
}: ToastProps) {
    React.useEffect(() => {
        const timer = keep ? undefined : window.setTimeout(onClose, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose, duration]);
    return (
        <div className={`${cls.toast} ${cls[`toast--${type}`] ?? ''}`}>
            <div className={cls.toast__body}>{children}</div>
            {closeable && (
                <button
                    className={cls.toast__close_btn}
                    onClick={() => onClose && onClose()}
                >
                    <Icon icon={'x-icon'} className={cls.toast__icon_right} />
                </button>
            )}
        </div>
    );
}
