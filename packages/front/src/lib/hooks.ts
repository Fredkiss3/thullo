import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { USER_QUERY, USER_TOKEN, BOARD_QUERY } from './constants';
import { deleteCookie, getCookie, jsonFetch, setCookie } from './functions';
import { Board, User } from './types';
import { useErrorsContext } from '../context/ErrorContext';

export function useUserQuery() {
    const { dispatch } = useErrorsContext();
    return useQuery<User>(
        USER_QUERY,
        async () => {
            const { data, errors } = await jsonFetch<{ user: User } | null>(
                `${import.meta.env.VITE_API_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                dispatch({
                    type: 'ADD_ERRORS',
                    errors,
                });
                throw new Error(JSON.stringify(errors));
            }

            return data!.user;
        },
        {
            retry: 1,
        }
    );
}

export function useBoardsQuery() {
    const { dispatch } = useErrorsContext();
    return useQuery<Board[]>(
        BOARD_QUERY,
        async () => {
            const { data, errors } = await jsonFetch<Board[]>(
                `${import.meta.env.VITE_API_URL}/api/boards/`,
                {
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                dispatch({
                    type: 'ADD_ERRORS',
                    errors,
                });
                throw new Error(JSON.stringify(errors));
            }

            return data;
        },
        {
            retry: 1,
        }
    );
}

export function useAuthenticatedUser(): {
    user: User;
    isLoading: boolean;
} {
    const navigate = useNavigate();
    const { data, isLoading, status } = useUserQuery();

    if (status === 'error') {
        navigate(`/login`);
    }
    return {
        user: data!,
        isLoading,
    };
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation(
        async () => {
            deleteCookie(USER_TOKEN);
        },
        {
            onMutate: async () => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(USER_QUERY);

                // Remove the user from the cache
                queryClient.setQueryData(USER_QUERY, null);
            },
            onSettled: () => {
                navigate('/login');
            },
        }
    );
}

export function useLoginMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { dispatch } = useErrorsContext();
    return useMutation(
        (authCode: string | null) =>
            jsonFetch<{ token: string }>(
                `${import.meta.env.VITE_API_URL}/api/auth`,
                {
                    method: 'POST',
                    body: JSON.stringify({ authCode }),
                }
            ),
        {
            onSuccess: ({ data, errors }) => {
                if (data.token) {
                    queryClient.invalidateQueries(USER_QUERY);
                    console.log('token', data.token);

                    setCookie(USER_TOKEN, data.token);
                    console.log('Set cookie', getCookie(USER_TOKEN));
                    navigate('/profile');
                } else {
                    dispatch({
                        type: 'ADD_ERRORS',
                        errors,
                    });
                    navigate(`/login`);
                }
            },
            onError: (err, _, context) => {
                dispatch({
                    type: 'ADD_ERRORS',
                    errors: JSON.parse((err as Error).message),
                });
                navigate(`/login`);
            },
        }
    );
}
