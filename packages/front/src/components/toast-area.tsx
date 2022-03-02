import * as React from 'react';
import ReactDOM from 'react-dom';

// Functions & Others
import { useToastContext } from '@/context/toast.context';

// Components
import { Toast } from '@/components/toast';

// Styles
import cls from '@/styles/components/toast.module.scss';

export interface ToastAreaProps {}

export function ToastArea({}: ToastAreaProps) {
    const { toasts, dispatch } = useToastContext();
    return ReactDOM.createPortal(
        toasts !== null ? (
            <div className={cls.toast_area}>
                {Object.entries(toasts).map(([key, message]) => (
                    <Toast
                        key={key}
                        keep={message.keep}
                        type={message.type}
                        closeable={message.closeable}
                        duration={message.duration}
                        onClose={() => dispatch({ type: 'REMOVE_TOAST', key })}
                    >
                        {message.message}
                    </Toast>
                ))}
            </div>
        ) : (
            <></>
        ),
        document.body
    );
}
