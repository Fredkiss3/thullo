import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { jsonFetch } from './functions';
import { User } from './types';

export const useUserQuery = () =>
    useQuery<User>(
        'user',
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
            retry: 2,
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

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation(
        async () => {
            const { data, errors } = await jsonFetch<{
                success: boolean;
            } | null>(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
            });

            return {
                success: data!.success ?? false,
                errors,
            };
        },
        {
            onMutate: async () => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                // await queryClient.cancelQueries('user');

                const user = queryClient.getQueryData<User>('user');

                queryClient.setQueryData('user', null);

                // Return a context object with the snapshotted value
                return { user };
            },
            // If the mutation fails, use the context returned from onMutate to roll back
            onError: (err, _, context) => {
                queryClient.setQueryData(
                    'user',
                    (context as { user: User }).user
                );
            },
            onSettled: () => {
                navigate('/');
            },
        }
    );
};
