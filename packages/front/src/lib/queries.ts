import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
    USER_QUERY,
    USER_TOKEN,
    BOARD_QUERY,
    SINGLE_BOARD_QUERY,
    SINGLE_CARD_QUERY,
} from './constants';
import {
    deleteCookie,
    formatAPIError,
    getCookie,
    getMax,
    jsonFetch,
    setCookie,
} from './functions';
import type {
    ApiErrors,
    Board,
    BoardDetails,
    BoardMember,
    Card,
    CardDetails,
    Label,
    List,
    ListWithId,
    PartialOmit,
    Photo,
    User,
} from './types';
import { useErrorsContext } from '@/context/error.context';
import { useToastContext } from '@/context/toast.context';
import { Color } from './types';

// Queries
export function useUserQuery() {
    return useQuery<User | null>(
        USER_QUERY,
        async () => {
            const { data } = await jsonFetch<{ user: User } | null>(
                `${import.meta.env.VITE_API_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

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

export function useSingleBoardQuery(id?: string) {
    return useQuery<BoardDetails | null>(
        [SINGLE_BOARD_QUERY, id],
        async () => {
            let data: BoardDetails | null = null;
            let errors: ApiErrors = null;
            if (id) {
                ({ data, errors } = await jsonFetch<BoardDetails | null>(
                    `${import.meta.env.VITE_API_URL}/api/boards/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                        },
                    }
                ));
            }

            if (errors) {
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

export function useSingleCardQuery(boardId?: string, id?: string) {
    return useQuery<CardDetails | null>(
        [SINGLE_BOARD_QUERY, boardId, SINGLE_CARD_QUERY, id],
        async () => {
            let data: CardDetails | null = null;
            let errors: ApiErrors = null;

            if (id && boardId) {
                ({ data, errors } = await jsonFetch<CardDetails | null>(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/boards/${boardId}/cards/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                        },
                    }
                ));
            } else {
                throw new Error('Invalid card id');
            }

            if (errors) {
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
            board: {
                name: string;
                coverPhotoId: string;
                coverPhotoUrl: string;
                private: boolean;
            };
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
                ctx.onSuccess();
            },
            onSettled: (ctx) => {
                queryClient.invalidateQueries(BOARD_QUERY);
            },
            onError: (err, _) => {
                try {
                    console.log(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `add-board-${new Date().getTime()}`,
                        message: `Could not add a board`,
                    });
                }
            },
        }
    );
}

export function useSetBoardVisibilityMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();
    return useMutation(
        async ({
            isPrivate,
            boardId,
            onSuccess,
        }: {
            boardId: string;
            isPrivate: boolean;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/set-visibility`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        private: isPrivate,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId };
        },
        {
            onMutate: async ({ boardId, isPrivate }) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-set-visibility`,
                    message: `Setting the visibility of the board to ${
                        isPrivate ? 'private' : 'public'
                    }...`,
                    keep: true,
                    closeable: false,
                });
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        isPrivate,
                    }
                );
            },
            onSettled: (ctx) => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-set-visibility`,
                });
            },
            onSuccess: (ctx) => {
                ctx.onSuccess();
            },
            onError: (err, { boardId, isPrivate }) => {
                try {
                    console.log(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-set-visibility-${new Date().getTime()}`,
                        message: `Could not set the visibility of board to ${
                            isPrivate ? 'private' : 'public'
                        }`,
                    });
                }

                // return the board to its previous state
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        isPrivate: !isPrivate,
                    }
                );
            },
        }
    );
}

export function useInviteMemberMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();
    return useMutation(
        async ({
            members,
            boardId,
            onSuccess,
        }: {
            boardId: string;
            members: BoardMember[];
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/participants/add`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        memberIds: members.map((m) => m.id),
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId };
        },
        {
            onMutate: async ({ boardId, members }) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-invite-member`,
                    message: `Adding a new member to the board...`,
                    keep: true,
                    closeable: false,
                });
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        participants: [...data!.participants, ...members],
                    }
                );
            },
            onSettled: (ctx) => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-invite-member`,
                });
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries(BOARD_QUERY);
                ctx.onSuccess();
            },
            onError: (err, { boardId, members }) => {
                try {
                    console.log(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-invite-${new Date().getTime()}`,
                        message: `Could not add members to the board`,
                    });
                }

                // return the board to its previous state
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // remove the members that were added
                const oldParticipants = data!.participants.filter(
                    (p) => !members.some((m) => m.id === p.id)
                );

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        participants: oldParticipants,
                    }
                );
            },
        }
    );
}

export function useRemoveMemberMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            member,
            boardId,
            onSuccess,
        }: {
            boardId: string;
            member: BoardMember;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/participants/remove`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        memberId: member.id,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId };
        },
        {
            onMutate: async ({ boardId, member }) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-remove-member`,
                    message: `Removing the member from the board...`,
                    keep: true,
                    closeable: false,
                });
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                const newParticipants = data!.participants.filter(
                    (p) => p.id !== member.id
                );

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        participants: newParticipants,
                    }
                );
            },
            onSettled: (ctx) => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-remove-member`,
                });
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries(BOARD_QUERY);
                ctx.onSuccess();
            },
            onError: (err, { boardId, member }) => {
                try {
                    console.log(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-remove-${new Date().getTime()}`,
                        message: `Could not remove the member from the board`,
                    });
                }

                // return the board to its previous state
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // readd the member that has been removed
                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        participants: [...data!.participants, member],
                    }
                );
            },
        }
    );
}

export function useChangeBoardNameMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            newName,
            oldName,
            boardId,
            onSuccess,
        }: {
            boardId: string;
            newName: string;
            oldName: string;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/set-name`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: newName,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, oldName };
        },
        {
            onMutate: async ({ boardId, newName }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-set-name`,
                    message: `Changing the board name...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        name: newName,
                    }
                );
            },
            onSettled: (ctx) => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-set-name`,
                });
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries(BOARD_QUERY);
                ctx.onSuccess();
            },
            onError: (err, { boardId, oldName }) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-set-name-${new Date().getTime()}`,
                        message: `Could not change the board name`,
                    });
                }

                // return the board to its previous state
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // reset the board name to the old name
                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        name: oldName,
                    }
                );
            },
        }
    );
}

export function useChangeBoardDescriptionMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            newDescription,
            oldDescription,
            boardId,
            onSuccess,
        }: {
            boardId: string;
            newDescription: string | null;
            oldDescription: string | null;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/set-description`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        description: newDescription,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, oldDescription };
        },
        {
            onMutate: async ({ boardId, newDescription }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-set-description`,
                    message: `Changing the description of the board...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        description: newDescription,
                    }
                );
            },
            onSettled: (ctx) => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-set-description`,
                });
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries(BOARD_QUERY);
                ctx.onSuccess();
            },
            onError: (err, { boardId, oldDescription }) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-set-descrition-${new Date().getTime()}`,
                        message: `Could not change the description of the board`,
                    });
                }

                // return the board to its previous state
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // reset the board description to the old description
                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        description: oldDescription,
                    }
                );
            },
        }
    );
}

export function useAddListMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            name,
            boardId,
            onSuccess,
        }: {
            boardId: string;
            name: string;
            onSuccess: () => void;
        }) => {
            const { data, errors } = await jsonFetch<Omit<List, 'cards'>>(
                `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, name, list: data };
        },
        {
            onMutate: async ({ boardId, name }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-add-list`,
                    message: `Add a new list to the board...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // new position is the last position
                const maxList = getMax(data!.lists, 'position');

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        lists: [
                            ...(data!.lists || []),
                            {
                                name,
                                cards: [],
                                position: maxList ? maxList.position + 1 : 0,
                            },
                        ],
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-add-list`,
                });
            },
            onSuccess: (ctx) => {
                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    ctx.boardId,
                ]);

                const newData = [
                    ...data!.lists.filter((list) => list.id !== undefined),
                    {
                        id: ctx.list.id,
                        name: ctx.name,
                        position: ctx.list.position,
                        cards: [],
                    },
                ];

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, ctx.boardId],
                    {
                        ...data!,
                        lists: newData,
                    }
                );
                ctx.onSuccess();
            },
            onError: (err, { boardId }) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-add-list-${new Date().getTime()}`,
                        message: `Could not add a new list to the board.`,
                    });

                    // revert the optimistic update
                    const data = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...data!,
                            lists: data!.lists.filter(
                                (list) => list.id !== undefined
                            ),
                        }
                    );
                }
            },
        }
    );
}

export function useRenameListMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            oldName,
            newName,
            boardId,
            listId,
            onSuccess,
        }: {
            boardId: string;
            listId: string;
            newName: string;
            oldName: string;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/lists/${listId}/rename`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: newName,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, newName, oldName, listId };
        },
        {
            onMutate: async ({ boardId, newName, oldName, listId }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-rename-list`,
                    message: `Renaming the list...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                const newLists = data!.lists.map((list) => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            name: newName,
                        };
                    }
                    return list;
                });

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        lists: newLists,
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-rename-list`,
                });
            },
            onSuccess: (ctx) => {
                // Change optimistically the board in the cache
                ctx.onSuccess();
            },
            onError: (err, { boardId, oldName, listId }) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-rename-list-${new Date().getTime()}`,
                        message: `Could not rename the list`,
                    });

                    // revert the optimistic update
                    const data = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    const newLists = data!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                name: oldName,
                            };
                        }
                        return list;
                    });

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...data!,
                            lists: newLists,
                        }
                    );
                }
            },
        }
    );
}

export function useDeleteListMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            boardId,
            list,
            onSuccess,
        }: {
            boardId: string;
            list: ListWithId;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists/${
                    list.id
                }`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, list };
        },
        {
            onMutate: async ({ boardId, list }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-delete-list`,
                    message: `Deleting the list...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                const newLists = data!.lists.filter((l) => l.id !== list.id);

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        lists: [...newLists],
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-delete-list`,
                });
            },
            onSuccess: (ctx) => {
                // Change optimistically the board in the cache
                ctx.onSuccess();
            },
            onError: (err, { boardId, list }) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    console.log(e);
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-delete-list-${new Date().getTime()}`,
                        message: `Could not delete the list`,
                    });

                    // revert the optimistic update
                    const data = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...data!,
                            lists: [...data!.lists, list],
                        }
                    );
                }
            },
        }
    );
}

export function useAddCardMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            title,
            boardId,
            listId,
            onSuccess,
        }: {
            boardId: string;
            listId: string;
            title: string;
            onSuccess: () => void;
        }) => {
            const { data, errors } = await jsonFetch<Card>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/lists/${listId}/cards`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, listId, card: data };
        },
        {
            onMutate: async ({ boardId, title, listId }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-add-card`,
                    message: `Add a new card to the list...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);

                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                const newLists: List[] = data!.lists.map((list) => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            cards: [
                                ...(list.cards || []),
                                {
                                    title,
                                    position: list.cards?.length || 0,
                                    labels: [],
                                    commentCount: 0,
                                    attachmentCount: 0,
                                },
                            ],
                        };
                    }
                    return list;
                });

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...data!,
                        lists: newLists,
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-add-card`,
                });
            },
            onSuccess: (ctx) => {
                // Change optimistically the board in the cache
                const data = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    ctx.boardId,
                ]);

                const newLists: List[] = data!.lists.map((list) => {
                    if (list.id === ctx.listId) {
                        return {
                            ...list,
                            cards: [
                                ...list.cards.filter(
                                    (card) => card.id !== undefined
                                ),
                                ctx.card,
                            ],
                        };
                    }
                    return list;
                });

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, ctx.boardId],
                    {
                        ...data!,
                        lists: newLists,
                    }
                );
                ctx.onSuccess();
            },
            onError: (err, { boardId, listId }) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-add-card-${new Date().getTime()}`,
                        message: `Could not add a new card to the selected list.`,
                    });
                } finally {
                    // Revert optimistic update
                    const data = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    const newLists: List[] = data!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                cards: list.cards.filter(
                                    (card) => card.id !== undefined
                                ),
                            };
                        }
                        return list;
                    });

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...data!,
                            lists: newLists,
                        }
                    );
                }
            },
        }
    );
}

export function useMoveCardMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            boardId,
            srcListId,
            destListId,
            cardId,
            position,
            oldPosition,
            onSuccess,
        }: {
            boardId: string;
            destListId: string;
            srcListId: string;
            cardId: string;
            position: number;
            oldPosition: number;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/move-card`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        listId: destListId,
                        cardId,
                        position,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return {
                onSuccess,
                boardId,
                srcListId,
                destListId,
                cardId,
                oldPosition,
            };
        },
        {
            onMutate: async ({ boardId }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-move-card`,
                    message: `Moving card...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);
            },
            onSettled: (ctx) => {
                // Invalidate the board cache
                if (ctx) {
                    queryClient.invalidateQueries([
                        SINGLE_BOARD_QUERY,
                        ctx.boardId,
                    ]);
                }

                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-move-card`,
                });
            },
            onSuccess: (ctx) => {
                ctx.onSuccess();
            },
            onError: (err, ctx) => {
                try {
                    console.error(`Error: ${err}`);
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-move-card-${new Date().getTime()}`,
                        message: `Could not move the selected card.`,
                    });
                } finally {
                    queryClient.invalidateQueries([
                        SINGLE_BOARD_QUERY,
                        ctx.boardId,
                    ]);
                }
            },
        }
    );
}

export function useChangeCardTitleMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            oldName,
            newName,
            boardId,
            cardId,
            listId,
            onSuccess,
        }: {
            boardId: string;
            cardId: string;
            listId: string;
            newName: string;
            oldName: string;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/cards/${cardId}/rename`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: newName,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return { onSuccess, boardId, newName, oldName, cardId, listId };
        },
        {
            onMutate: async ({ boardId, newName, cardId, listId }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-rename-card`,
                    message: `Updating the card...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                // Change optimistically the board in the cache
                const boardData = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // Change optimistically the card in the cache
                const cardData = queryClient.getQueryData<CardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                queryClient.setQueryData<CardDetails>(
                    [SINGLE_BOARD_QUERY, boardId, SINGLE_CARD_QUERY, cardId],
                    {
                        ...cardData!,
                        title: newName,
                    }
                );

                const newLists = boardData!.lists.map((list) => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            cards: list.cards.map((card) => {
                                if (card.id === cardId) {
                                    return {
                                        ...card,
                                        title: newName,
                                    };
                                }
                                return card;
                            }),
                        };
                    }
                    return list;
                });

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...boardData!,
                        lists: newLists,
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-rename-card`,
                });
            },
            onSuccess: (ctx) => {
                // Change optimistically the board in the cache
                ctx.onSuccess();
            },
            onError: (err, { boardId, oldName, listId, cardId }) => {
                try {
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-rename-card-${new Date().getTime()}`,
                        message: `Could not update the card`,
                    });

                    // revert the optimistic update for the card
                    const boardData = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    const cardData = queryClient.getQueryData<CardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                        SINGLE_CARD_QUERY,
                        cardId,
                    ]);

                    queryClient.setQueryData<CardDetails>(
                        [
                            SINGLE_BOARD_QUERY,
                            boardId,
                            SINGLE_CARD_QUERY,
                            cardId,
                        ],
                        {
                            ...cardData!,
                            title: oldName,
                        }
                    );

                    const newLists = boardData!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                cards: list.cards.map((card) => {
                                    if (card.id === cardId) {
                                        return {
                                            ...card,
                                            title: oldName,
                                        };
                                    }
                                    return card;
                                }),
                            };
                        }
                        return list;
                    });

                    // revert the optimistic update for the board
                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...boardData!,
                            lists: newLists,
                        }
                    );
                }
            },
        }
    );
}

export function useChangeCardCoverMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            oldCoverPhotoUrl,
            newCover,
            boardId,
            cardId,
            listId,
            onSuccess,
        }: {
            boardId: string;
            cardId: string;
            listId: string;
            newCover: Photo | null;
            oldCoverPhotoUrl: string | null;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/cards/${cardId}/set-cover`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        coverPhotoId: newCover?.id ?? undefined,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return {
                onSuccess,
                boardId,
                cardId,
                listId,
                newCover,
                oldCoverPhotoUrl,
            };
        },
        {
            onMutate: async ({ boardId, newCover, cardId, listId }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-change-cover`,
                    message: `Updating the card cover...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);
                await queryClient.cancelQueries([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                // Change optimistically the board in the cache
                const boardData = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // Change optimistically the card in the cache
                const cardData = queryClient.getQueryData<CardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                queryClient.setQueryData<CardDetails>(
                    [SINGLE_BOARD_QUERY, boardId, SINGLE_CARD_QUERY, cardId],
                    {
                        ...cardData!,
                        coverURL: newCover?.regularURL ?? null,
                    }
                );

                const newLists = boardData!.lists.map((list) => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            cards: list.cards.map((card) => {
                                if (card.id === cardId) {
                                    return {
                                        ...card,
                                        coverURL: newCover?.smallURL ?? null,
                                    };
                                }
                                return card;
                            }),
                        };
                    }
                    return list;
                });

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...boardData!,
                        lists: newLists,
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-change-cover`,
                });
            },
            onSuccess: ({ onSuccess, cardId, boardId }) => {
                queryClient.invalidateQueries([SINGLE_BOARD_QUERY, boardId]);
                queryClient.invalidateQueries([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                onSuccess();
            },
            onError: (err, { boardId, oldCoverPhotoUrl, listId, cardId }) => {
                try {
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-change-cover-${new Date().getTime()}`,
                        message: `Could not change the card cover`,
                    });

                    // revert the optimistic update for the card
                    const boardData = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    const cardData = queryClient.getQueryData<CardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                        SINGLE_CARD_QUERY,
                        cardId,
                    ]);

                    queryClient.setQueryData<CardDetails>(
                        [
                            SINGLE_BOARD_QUERY,
                            boardId,
                            SINGLE_CARD_QUERY,
                            cardId,
                        ],
                        {
                            ...cardData!,
                            coverURL: oldCoverPhotoUrl,
                        }
                    );

                    const newLists = boardData!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                cards: list.cards.map((card) => {
                                    if (card.id === cardId) {
                                        return {
                                            ...card,
                                            coverURL: oldCoverPhotoUrl,
                                        };
                                    }
                                    return card;
                                }),
                            };
                        }
                        return list;
                    });

                    // revert the optimistic update for the board
                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...boardData!,
                            lists: newLists,
                        }
                    );
                }
            },
        }
    );
}

export function useChangeCardDescriptionMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            oldDescription,
            newDescription,
            boardId,
            cardId,
            onSuccess,
        }: {
            boardId: string;
            cardId: string;
            newDescription: string | null;
            oldDescription: string | null;
            onSuccess: () => void;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/cards/${cardId}/set-description`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        description: newDescription,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return {
                onSuccess,
                boardId,
                newDescription,
                oldDescription,
                cardId,
            };
        },
        {
            onMutate: async ({ boardId, newDescription, cardId }) => {
                dispatch({
                    type: 'ADD_INFO',
                    key: `board-change-card-description`,
                    message: `Updating the card...`,
                    keep: true,
                    closeable: false,
                });

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                // Change optimistically the card in the cache
                const cardData = queryClient.getQueryData<CardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                queryClient.setQueryData<CardDetails>(
                    [SINGLE_BOARD_QUERY, boardId, SINGLE_CARD_QUERY, cardId],
                    {
                        ...cardData!,
                        description: newDescription,
                    }
                );
            },
            onSettled: () => {
                dispatch({
                    type: 'REMOVE_TOAST',
                    key: `board-change-card-description`,
                });
            },
            onSuccess: (ctx) => {
                // Change optimistically the board in the cache
                ctx.onSuccess();
            },
            onError: (err, { boardId, oldDescription, cardId }) => {
                try {
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `board-change-card-description-${new Date().getTime()}`,
                        message: `Could not update the card`,
                    });

                    // revert the optimistic update for the card
                    const cardData = queryClient.getQueryData<CardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                        SINGLE_CARD_QUERY,
                        cardId,
                    ]);

                    queryClient.setQueryData<CardDetails>(
                        [
                            SINGLE_BOARD_QUERY,
                            boardId,
                            SINGLE_CARD_QUERY,
                            cardId,
                        ],
                        {
                            ...cardData!,
                            description: oldDescription,
                        }
                    );
                }
            },
        }
    );
}

export function useAddLabelToCardMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            boardId,
            cardId,
            labelColor,
            labelId,
            listId,
            labelName,
        }: {
            boardId: string;
            cardId: string;
            listId: string;
            labelId: string | null;
            labelColor: Color;
            labelName: string;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/cards/${cardId}/add-label`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        labelId,
                        color: labelColor,
                        name: labelName,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return {
                boardId,
                cardId,
                labelId,
                labelColor,
                labelName,
                listId,
            };
        },
        {
            onMutate: async ({
                boardId,
                labelId,
                labelName,
                labelColor,
                cardId,
                listId,
            }) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);
                await queryClient.cancelQueries([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                // Change optimistically the board in the cache
                const boardData = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // Change optimistically the card in the cache
                const cardData = queryClient.getQueryData<CardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                const labelAlreadyExists =
                    cardData!.labels.find((label) => label.id === labelId) !==
                    undefined;

                if (!labelAlreadyExists) {
                    const newLabel: PartialOmit<Label, 'id'> = {
                        id: labelId ?? undefined,
                        name: labelName,
                        color: labelColor,
                    };

                    // update the card
                    queryClient.setQueryData<CardDetails>(
                        [
                            SINGLE_BOARD_QUERY,
                            boardId,
                            SINGLE_CARD_QUERY,
                            cardId,
                        ],
                        {
                            ...cardData!,
                            labels: [...cardData!.labels, newLabel],
                        }
                    );

                    // update the card in the board
                    const newLists = boardData!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                cards: list.cards.map((card) => {
                                    if (card.id === cardId) {
                                        card.labels.push(newLabel);
                                    }
                                    return card;
                                }),
                            };
                        }
                        return list;
                    });

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...boardData!,
                            lists: newLists,
                        }
                    );
                }
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries([
                    SINGLE_BOARD_QUERY,
                    ctx.boardId,
                    SINGLE_CARD_QUERY,
                    ctx.cardId,
                ]);
                queryClient.invalidateQueries([
                    SINGLE_BOARD_QUERY,
                    ctx.boardId,
                ]);
            },
            onError: (err, { boardId, labelId, listId, cardId }) => {
                try {
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `card-add-label-${new Date().getTime()}`,
                        message: `Could not add the label to the card`,
                    });

                    // revert the optimistic update for the card
                    const boardData = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    const cardData = queryClient.getQueryData<CardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                        SINGLE_CARD_QUERY,
                        cardId,
                    ]);

                    const newLabels = cardData!.labels.filter(
                        (label) =>
                            label.id !== labelId || label.id !== undefined
                    );

                    queryClient.setQueryData<CardDetails>(
                        [
                            SINGLE_BOARD_QUERY,
                            boardId,
                            SINGLE_CARD_QUERY,
                            cardId,
                        ],
                        {
                            ...cardData!,
                            labels: newLabels,
                        }
                    );

                    // revert the optimistic update for the board
                    const newLists = boardData!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                cards: list.cards.map((card) => {
                                    if (card.id === cardId) {
                                        card.labels = newLabels;
                                    }
                                    return card;
                                }),
                            };
                        }
                        return list;
                    });

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...boardData!,
                            lists: newLists,
                        }
                    );
                }
            },
        }
    );
}

export function useRemoveLabelFromCardMutation() {
    const queryClient = useQueryClient();
    const { dispatch } = useToastContext();

    return useMutation(
        async ({
            boardId,
            cardId,
            label,
            listId,
        }: {
            boardId: string;
            cardId: string;
            listId: string;
            label: Label;
        }) => {
            const { errors } = await jsonFetch<{ success: boolean }>(
                `${
                    import.meta.env.VITE_API_URL
                }/api/boards/${boardId}/cards/${cardId}/remove-label`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        labelId: label.id,
                    }),
                    headers: {
                        Authorization: `Bearer ${getCookie(USER_TOKEN)}`,
                    },
                }
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return {
                boardId,
                cardId,
                label,
                listId,
            };
        },
        {
            onMutate: async ({ boardId, label, cardId, listId }) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries([SINGLE_BOARD_QUERY, boardId]);
                await queryClient.cancelQueries([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                // Change optimistically the board in the cache
                const boardData = queryClient.getQueryData<BoardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                ]);

                // Change optimistically the card in the cache
                const cardData = queryClient.getQueryData<CardDetails>([
                    SINGLE_BOARD_QUERY,
                    boardId,
                    SINGLE_CARD_QUERY,
                    cardId,
                ]);

                const newLabels = cardData!.labels.filter(
                    (l) => label.id !== l.id
                );

                // update the card
                queryClient.setQueryData<CardDetails>(
                    [SINGLE_BOARD_QUERY, boardId, SINGLE_CARD_QUERY, cardId],
                    {
                        ...cardData!,
                        labels: newLabels,
                    }
                );

                // update the card in the board
                const newLists = boardData!.lists.map((list) => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            cards: list.cards.map((card) => {
                                if (card.id === cardId) {
                                    card.labels = newLabels;
                                }
                                return card;
                            }),
                        };
                    }
                    return list;
                });

                queryClient.setQueryData<BoardDetails>(
                    [SINGLE_BOARD_QUERY, boardId],
                    {
                        ...boardData!,
                        lists: newLists,
                    }
                );
            },
            onSuccess: (ctx) => {
                queryClient.invalidateQueries([
                    SINGLE_BOARD_QUERY,
                    ctx.boardId,
                    SINGLE_CARD_QUERY,
                    ctx.cardId,
                ]);
                queryClient.invalidateQueries([
                    SINGLE_BOARD_QUERY,
                    ctx.boardId,
                ]);
            },
            onError: (err, { boardId, label, listId, cardId }) => {
                try {
                    const errors = JSON.parse(
                        (err as Error).message
                    ) as ApiErrors;
                    if (errors) {
                        dispatch({
                            type: 'ADD_TOASTS',
                            toasts: formatAPIError(errors),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: 'ADD_ERROR',
                        key: `card-remove-label-${new Date().getTime()}`,
                        message: `Could not remove the label from the card`,
                    });

                    // revert the optimistic update for the card
                    const boardData = queryClient.getQueryData<BoardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                    ]);

                    const cardData = queryClient.getQueryData<CardDetails>([
                        SINGLE_BOARD_QUERY,
                        boardId,
                        SINGLE_CARD_QUERY,
                        cardId,
                    ]);

                    cardData!.labels.push(label);

                    queryClient.setQueryData<CardDetails>(
                        [
                            SINGLE_BOARD_QUERY,
                            boardId,
                            SINGLE_CARD_QUERY,
                            cardId,
                        ],
                        {
                            ...cardData!,
                        }
                    );

                    // revert the optimistic update for the board
                    const newLists = boardData!.lists.map((list) => {
                        if (list.id === listId) {
                            return {
                                ...list,
                                cards: list.cards.map((card) => {
                                    if (card.id === cardId) {
                                        card.labels.push(label);
                                    }
                                    return card;
                                }),
                            };
                        }
                        return list;
                    });

                    queryClient.setQueryData<BoardDetails>(
                        [SINGLE_BOARD_QUERY, boardId],
                        {
                            ...boardData!,
                            lists: newLists,
                        }
                    );
                }
            },
        }
    );
}
