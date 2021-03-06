import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Input } from './input';
import { jsonFetch, getApiURL } from '@/lib/functions';
import { Skeleton } from './skeleton';
import { PhotoSearch } from './photo-search';

import { useAddBoardMutation } from '@/lib/queries';
import { Photo } from '@/lib/types';
import { useDropdownToggle, useToggle } from '@/lib/hooks';

import cls from '@/styles/components/addboard-form.module.scss';
import { useToastContext } from '@/context/toast.context';

export interface AddBoardCardProps {
    onClose: () => void;
}

export const AddBoardForm = React.forwardRef<
    HTMLButtonElement,
    AddBoardCardProps
>(({ onClose }, ref) => {
    const { dispatch } = useToastContext();

    // get a random cover from the API when the component is mounted
    React.useEffect(() => {
        async function getRandomPhoto() {
            const { data, errors } = await jsonFetch<Photo | null>(
                `${getApiURL()}/api/proxy/unsplash/random/`
            );

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
            onSuccess: () => {
                onClose();
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: 'add-board-success',
                    message: 'Board added successfully',
                });
            },
        });
    }

    const [boardName, setBoardName] = React.useState('');
    const [isPrivate, togglePrivate] = useToggle(false);
    const [cover, setCover] = React.useState<Photo | null>(null);

    // from the dropdown toggle
    const [coverButtonRef, isCoverDropdownOpen, toggleCoverDropdown] =
        useDropdownToggle();

    return (
        <form
            className={cls.addboard_form}
            onSubmit={handleSubmit}
            data-test-id="addboard-form"
        >
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
                testId="addboard-form-close-button"
                isStatic
                renderLeadingIcon={(cls) => (
                    <Icon icon="x-icon" className={cls} />
                )}
            />

            {/* The input for the board name */}
            <Input
                testId="addboard-form-board-title"
                placeholder="Add board title"
                value={boardName}
                onChange={setBoardName}
            />

            {/* Actions Button */}
            <div className={cls.addboard_form__actions_buttons}>
                <div
                    className={cls.addboard_form__actions_buttons__action}
                    ref={coverButtonRef}
                >
                    <Button
                        testId="addboard-form-cover-button"
                        isStatic={isCoverDropdownOpen}
                        variant={isCoverDropdownOpen ? 'black' : 'hollow'}
                        className={
                            cls.addboard_form__actions_buttons__action__button
                        }
                        renderLeadingIcon={(cls) => (
                            <Icon icon={'media'} className={cls} />
                        )}
                        onClick={toggleCoverDropdown}
                    >
                        Cover
                    </Button>

                    <PhotoSearch
                        show={isCoverDropdownOpen}
                        onSelect={setCover}
                    />
                </div>
                <div className={cls.addboard_form__actions_buttons__action}>
                    <Button
                        isStatic={isPrivate}
                        variant={!isPrivate ? 'hollow' : 'black'}
                        onClick={togglePrivate}
                        className={
                            cls.addboard_form__actions_buttons__action__button
                        }
                        renderLeadingIcon={(cls) => (
                            <Icon
                                icon={isPrivate ? 'lock-closed' : 'globe'}
                                className={cls}
                            />
                        )}
                    >
                        {isPrivate ? 'Private' : 'Public'}
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
