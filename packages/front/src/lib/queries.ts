import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
    USER_QUERY,
    USER_TOKEN,
    BOARD_QUERY,
    SINGLE_BOARD_QUERY,
} from './constants';
import { deleteCookie, getCookie, jsonFetch, setCookie } from './functions';
import type {
    AddBoardRequest,
    ApiErrors,
    Board,
    BoardDetails,
    User,
} from './types';
import { useErrorsContext } from '@/context/error.context';
import { useToastContext } from '@/context/toast.context';

// Queries
export function useUserQuery() {
    const { dispatch } = useErrorsContext();
    return useQuery<User | null>(
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
            }

            return data ? data.user : null;
        },
        {
            retry: 2,
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

// Mutations
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
            jsonFetch<{ token?: string }>(
                `${import.meta.env.VITE_API_URL}/api/auth`,
                {
                    method: 'POST',
                    body: JSON.stringify({ authCode }),
                }
            ),
        {
            onSuccess: ({ data, errors }) => {
                if (errors === null && data.token) {
                    queryClient.invalidateQueries(USER_QUERY);
                    setCookie(USER_TOKEN, data.token);
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

export function useAddBoardMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();
    return useMutation(
        async ({
            board,
            onSuccess,
        }: {
            board: AddBoardRequest;
            onSuccess: () => void;
        }) => {
            const { data, errors } = await jsonFetch<Board>(
                `${import.meta.env.VITE_API_URL}/api/boards`,
                {
                    method: 'POST',
                    body: JSON.stringify(board),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { board: data!, onSuccess };
        },
        {
            onMutate: async ({ board, onSuccess }) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(BOARD_QUERY);

                // Add the board to the cache
                const data = queryClient.getQueryData<Board[]>(BOARD_QUERY);
                const user = queryClient.getQueryData<User>(USER_QUERY);

                queryClient.setQueryData<Board[]>(BOARD_QUERY, [
                    ...data!,
                    {
                        name: board.name,
                        cover: {
                            url: board.coverPhotoUrl,
                        },
                        participants: [
                            {
                                login: user!.login,
                                id: user!.id,
                                name: user!.name,
                                avatarURL: user!.avatarURL,
                            },
                        ],
                    },
                ]);
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries(BOARD_QUERY);
                ctx.onSuccess();
            },
            onError: (err, _, context) => {
                const errors = JSON.parse((err as Error).message) as ApiErrors;
                if (errors) {
                    dispatch({
                        type: 'ADD_TOASTS',
                        toasts: Object.entries(errors).map(([key, values]) => ({
                            key,
                            type: 'error',
                            message: values.join(', '),
                        })),
                    });
                }

                // dispatch({
                //     type: 'ADD_ERROR',
                //     key: 'addBoard',
                //     message: (err as Error).message,
                // });
            },
        }
    );
}

export function useSingleBoardQuery(id: string) {
    const { dispatch } = useErrorsContext();
    return useQuery<BoardDetails | null>(
        [SINGLE_BOARD_QUERY, id],
        async () => {
            const { data, errors } = await jsonFetch<BoardDetails | null>(
                `${import.meta.env.VITE_API_URL}/api/boards/${id}`,
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
                // indicate that the board is not found
                throw new Error(JSON.stringify(errors));
            }

            return data;
        },
        {
            retry: 0,
        }
    );
}
