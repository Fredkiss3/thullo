import * as React from 'react';
import { Button } from './button';
import cls from '../styles/components/addboard-form.module.scss';
import { Icon } from './icon';
import { Input } from './input';
import { useEffect } from 'react';
import { jsonFetch } from '../lib/functions';
import { Skeleton } from './skeleton';
import { useAddBoardMutation } from '../lib/queries';
import { PhotoSearch } from './photo-search';
import { Photo } from '../lib/types';
import { useOnClickOutside } from '../lib/hooks';

export interface AddBoardCardProps {
    onClose: () => void;
}

export const AddBoardForm = React.forwardRef<
    HTMLButtonElement,
    AddBoardCardProps
>(({ onClose }, ref) => {
    // get a random cover from the API when the component is mounted
    useEffect(() => {
        async function getRandomPhoto() {
            const { data, errors } = await jsonFetch<Photo | null>(
                `${import.meta.env.VITE_API_URL}/api/proxy/unsplash/random/`
            );

            console.log(data, errors);
            if (errors !== null || data === null) {
                return;
            } else {
                setCover(data);
            }
        }

        if (cover === null) {
            getRandomPhoto();
        }
    }, []);

    // use the mutation to create a new board
    const mutation = useAddBoardMutation();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        mutation.mutate({
            board: {
                name: boardName,
                private: isPrivate,
                coverPhotoId: cover!.id,
                coverPhotoUrl: cover!.smallURL,
            },
            onSuccess: onClose,
        });
    }

    const [boardName, setBoardName] = React.useState('');
    const [isPrivate, setIsPrivate] = React.useState(false);
    const [isCoverDropdownOpen, SetIsCoverDropdownOpen] = React.useState(false);
    const [cover, setCover] = React.useState<Photo | null>(null);
    const coverButtonRef = React.useRef(null);

    // when the user clicks outside of the cover dropdown, close it
    useOnClickOutside(coverButtonRef, () => {
        SetIsCoverDropdownOpen(false);
    });

    return (
        <form className={cls.addboard_form} onSubmit={handleSubmit}>
            {cover ? (
                <div className={cls.addboard_form__cover}>
                    <img
                        className={cls.addboard_form__cover__image}
                        src={cover.smallURL}
                        alt="Image de couverture du tableau"
                    />

                    <div className={cls.addboard_form__cover__author}>
                        <a
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            href={`https://unsplash.com/@${cover.authorUserName}?utm_source=thullo-front&utm_medium=referral`}
                        >
                            Photo By {cover.authorName}
                        </a>
                    </div>
                </div>
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
                <div
                    className={cls.addboard_form__actions_buttons__action}
                    ref={coverButtonRef}
                >
                    <Button
                        variant={isCoverDropdownOpen ? 'black' : 'hollow'}
                        className={
                            cls.addboard_form__actions_buttons__action__button
                        }
                        renderLeadingIcon={(cls) => (
                            <Icon icon={'media'} className={cls} />
                        )}
                        onClick={() =>
                            SetIsCoverDropdownOpen(!isCoverDropdownOpen)
                        }
                    >
                        Cover
                    </Button>

                    <PhotoSearch
                        show={isCoverDropdownOpen}
                        onSelect={(photo) => {
                            setCover(photo);
                        }}
                    />
                </div>
                <div className={cls.addboard_form__actions_buttons__action}>
                    <Button
                        isStatic={isPrivate}
                        variant={!isPrivate ? 'hollow' : 'black'}
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={
                            cls.addboard_form__actions_buttons__action__button
                        }
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
