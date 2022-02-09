import * as React from 'react';
import { Button } from './button';
import cls from '../styles/components/addboard-form.module.scss';
import { Icon } from './icon';
import { Input } from './input';
import { useEffect } from 'react';
import { jsonFetch } from '../lib/functions';
import { Skeleton } from './skeleton';
import { useAddBoardMutation } from '../lib/hooks';

export interface AddBoardCardProps {
    onClose: () => void;
}

export const AddBoardForm = React.forwardRef<
    HTMLButtonElement,
    AddBoardCardProps
>(({ onClose }, ref) => {
    const [cover, setCover] = React.useState<{
        id: string;
        url: string;
    } | null>(null);

    const mutation = useAddBoardMutation();

    // get a random cover from the API when the component mounts
    useEffect(() => {
        const getRandomPhoto = async () => {
            const { data, errors } = await jsonFetch<{
                smallURL: string;
                id: string;
            } | null>(
                `${import.meta.env.VITE_API_URL}/api/proxy/unsplash/random/`
            );

            console.log(data, errors);
            if (errors !== null || data === null) {
                return;
            } else {
                setCover({
                    id: data!.id,
                    url: data!.smallURL,
                });
            }
        };
        getRandomPhoto();
    }, []);

    const [boardName, setBoardName] = React.useState('');
    const [isPrivate, setIsPrivate] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        mutation.mutate({
            board: {
                name: boardName,
                private: isPrivate,
                coverPhotoId: cover!.id,
                coverPhotoUrl: cover!.url,
            },
            onSuccess: onClose,
        });
    };

    return (
        <form className={cls.addboard_form} onSubmit={handleSubmit}>
            {cover ? (
                <img
                    className={cls.addboard_form__cover}
                    src={cover.url}
                    alt="Image de couverture du tableau"
                />
            ) : (
                <Skeleton className={cls.addboard_form__cover_placeholder} />
            )}

            {/* Cancel Button */}
            <Button
                onClick={onClose}
                className={cls.addboard_form__cancel_button}
                ariaLabel="close modal"
                variant="primary"
                square
                isStatic
                renderLeadingIcon={(cls) => (
                    <Icon icon="x-icon" className={cls} />
                )}
            />

            {/* The input for the board name */}
            <Input
                placeholder="Add board title"
                value={boardName}
                onChange={(value) => setBoardName(value)}
            />

            {/* Actions Button */}
            <div className={cls.addboard_form__actions_buttons}>
                <Button
                    variant="hollow"
                    className={cls.addboard_form__actions_buttons__button}
                    renderLeadingIcon={(cls) => (
                        <Icon icon={'media'} className={cls} />
                    )}
                >
                    Cover
                </Button>
                <Button
                    isStatic
                    variant={!isPrivate ? 'hollow' : 'primary'}
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={cls.addboard_form__actions_buttons__button}
                    renderLeadingIcon={(cls) => (
                        <Icon
                            icon={isPrivate ? 'lock-closed' : 'lock-open'}
                            className={cls}
                        />
                    )}
                >
                    Private
                </Button>
            </div>

            {/* Footer Buttons */}
            <div className={cls.addboard_form__footer}>
                <Button ref={ref} onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={
                        boardName.length === 0 ||
                        cover === null ||
                        mutation.isLoading
                    }
                    renderLeadingIcon={(cls) => (
                        <Icon icon={`plus`} className={cls} />
                    )}
                >
                    {cover === null
                        ? 'Loading cover...'
                        : mutation.isLoading
                        ? 'Creating...'
                        : 'Create'}
                </Button>
            </div>
        </form>
    );
});
