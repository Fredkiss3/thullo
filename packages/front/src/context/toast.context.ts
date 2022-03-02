import { createContext, useContext } from 'react';
import type { ToastContextData, ToastMessage, ToastType } from '@/lib/types';

type AddToastAction = {
    type: 'ADD_ERROR' | 'ADD_SUCCESS' | 'ADD_INFO';
    duration?: number;
    key: string;
    message: string;
    keep?: boolean;
    closeable?: boolean;
};

type AddToastsAction = {
    type: 'ADD_TOASTS';
    duration?: number;
    toasts: {
        key: string;
        type: ToastType;
        message: string;
    }[];
};

type RemoveToastAction = {
    type: 'REMOVE_TOAST';
    key: string;
};

type ClearErrorsAction = {
    type: 'CLEAR_TOASTS';
};

export type ToastContextActions =
    | ClearErrorsAction
    | AddToastAction
    | RemoveToastAction
    | AddToastsAction;

export function toastReducer(
    data: ToastContextData,
    action: ToastContextActions
): ToastContextData {
    switch (action.type) {
        case 'ADD_ERROR': {
            const { key, message } = action;
            const newElement: ToastContextData = {
                [key]: {
                    type: 'error',
                    message: message,
                    duration: action.duration,
                    keep: action.keep,
                    closeable: action.closeable,
                },
            };

            if (data === null) {
                return newElement;
            }

            return {
                ...data,
                ...newElement,
            };
        }
        case 'ADD_INFO':
            const { key, message } = action;
            const newElement: ToastContextData = {
                [key]: {
                    type: 'info',
                    message: message,
                    duration: action.duration,
                    keep: action.keep,
                    closeable: action.closeable,
                },
            };

            if (data === null) {
                return newElement;
            }

            return {
                ...data,
                ...newElement,
            };
        case 'ADD_SUCCESS': {
            const { key, message } = action;
            const newElement: ToastContextData = {
                [key]: {
                    type: 'success',
                    message: message,
                    duration: action.duration,
                    keep: action.keep,
                    closeable: action.closeable,
                },
            };

            if (data === null) {
                return newElement;
            }

            return {
                ...data,
                ...newElement,
            };
        }
        case 'REMOVE_TOAST': {
            const { key } = action;
            if (data !== null) {
                const { [key]: value, ...rest } = data;
                return rest;
            }

            return data;
        }
        case 'ADD_TOASTS':
            return {
                ...data,
                ...action.toasts.reduce(
                    (acc, toast) => ({
                        ...acc,
                        [toast.key]: {
                            type: toast.type,
                            message: toast.message,
                            duration: action.duration,
                        },
                    }),
                    {}
                ),
            };
        case 'CLEAR_TOASTS': {
            return null;
        }
    }
}

// Context Initial values
export const ToastContext = createContext<{
    toasts: ToastContextData;
    dispatch: React.Dispatch<ToastContextActions>;
}>({
    toasts: null,
    dispatch: () => {},
});

export const useToastContext = () => {
    return useContext(ToastContext);
};
