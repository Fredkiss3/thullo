import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { USER_QUERY, USER_TOKEN } from './constants';
import { deleteCookie, jsonFetch, setCookie } from './functions';
import { User } from './types';

export const useUserQuery = () =>
    useQuery<User>(
        USER_QUERY,
        async () => {
            const { data, errors } = await jsonFetch<{ user: User } | null>(
                `${import.meta.env.VITE_API_URL}/api/auth/me`
            );

            if (errors) {
                throw new Error(JSON.stringify(errors));
            }

            return data!.user;
        },
        {
            retry: 1,
        }
    );

export function useAuthenticatedUser(): {
    user: User;
    isLoading: boolean;
} {
    const { data, error, isLoading, status } = useUserQuery();
    const navigate = useNavigate();

    if (status === 'error') {
        navigate(
            `/login?errors=${encodeURIComponent((error as Error).message)}`
        );
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
                navigate('/');
            },
        }
    );
}

export function useLoginMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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
                    setCookie(USER_TOKEN, data.token);
                    navigate('/profile');
                } else {
                    navigate(
                        `/login?errors=${encodeURIComponent(
                            JSON.stringify(errors)
                        )}`
                    );
                }
            },
            onError: (err, _, context) => {
                navigate(
                    `/login?errors=${encodeURIComponent(
                        (err as Error).message
                    )}`
                );
            },
        }
    );
}
