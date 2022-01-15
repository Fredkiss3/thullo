import { createContext, useContext, useState } from 'react';
import { ApiErrors } from '../lib/types';

// Dispatches errors to the ErrorContext

type AddErrorAction = {
    type: 'ADD_ERROR';
    key: string;
    value: string;
};

type RemoveErrorAction = {
    type: 'REMOVE_ERROR';
    key: string;
};

type AddErrorsAction = {
    type: 'ADD_ERRORS';
    errors: ApiErrors;
};

type ClearErrorsAction = {
    type: 'CLEAR_ERRORS';
};

type ErrorContextActions =
    | ClearErrorsAction
    | AddErrorAction
    | RemoveErrorAction
    | AddErrorsAction;

export function errorReducer(errors: ApiErrors, action: ErrorContextActions) {
    switch (action.type) {
        case 'ADD_ERRORS': {
            return { ...errors, ...action.errors };
        }
        case 'ADD_ERROR': {
            const { key, value } = action;
            if (errors !== null && errors[key]) {
                errors[key].push(value);
            } else if (errors) {
                errors[key] = [value];
            } else {
                errors = { [key]: [value] };
            }
            return { ...errors };
        }
        case 'REMOVE_ERROR': {
            const { key } = action;
            if (errors !== null && errors[key]) {
                const { [key]: valueToRemove, ...restOfErrors } = errors;
                return restOfErrors;
            }
            return errors;
        }
        case 'CLEAR_ERRORS': {
            return null;
        }
    }
}

// Context Initial values
export const ErrorContext = createContext<{
    errors: ApiErrors;
    dispatch: React.Dispatch<ErrorContextActions>;
}>({
    errors: null,
    dispatch: () => {},
});

export const useErrorsContext = () => {
    return useContext(ErrorContext);
};

export const ErrorProvider = ErrorContext.Provider;
