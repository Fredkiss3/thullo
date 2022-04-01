import * as React from 'react';
// functions and other
import { clsx, renderMarkdown } from '@/lib/functions';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropdownToggle, useEffectNotFirst, useToggle } from '@/lib/hooks';
import { useCardDetailsData } from '@/lib/page-hooks';

// components
import { Modal } from '@/components/modal';
import { Seo } from '@/components/seo';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { Loader } from '@/components/loader';
import { TextareaAutogrow } from '@/components/textarea-autogrow';

// styles
import cls from '@/styles/pages/dashboard/card.module.scss';
import { Input } from '@/components/input';
import {
    useChangeCardCoverMutation,
    useChangeCardDescriptionMutation,
    useChangeCardTitleMutation,
} from '@/lib/queries';
import { useToastContext } from '@/context/toast.context';
import { FormEvent } from 'react';
import { Photo } from '@/lib/types';
import { PhotoSearch } from '@/components/photo-search';

export interface CardDetailsProps {}

export function CardDetails({}: CardDetailsProps) {
    // global data
    const { board, card, canEditCard, parentListName, isLoading } =
        useCardDetailsData();
    const navigate = useNavigate();
    const { dispatch } = useToastContext();

    // mutations
    const changeCardTitleMutation = useChangeCardTitleMutation();
    const changeCardDescriptionMutation = useChangeCardDescriptionMutation();
    const changeCardCoverMutation = useChangeCardCoverMutation();

    // state & ref
    const [isOpen, setIsOpen] = React.useState(true);
    const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

    if (!board) {
        return <></>;
    }

    return (
        <>
            <Seo title={card?.title ?? 'Card Details'} />
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                cancelButtonRef={cancelButtonRef}
                className={clsx(cls.card_details, {
                    [cls[`card_details--loading`]]: isLoading,
                })}
            >
                <div className={cls.card_details__content}>
                    {isLoading && !card ? (
                        <>
                            <Loader />
                        </>
                    ) : (
                        <>
                            <Button
                                ref={cancelButtonRef}
                                onClick={closeModal}
                                className={
                                    cls.card_details__content__close_button
                                }
                                ariaLabel="close modal"
                                variant="primary"
                                square
                                testId="addboard-form-close-button"
                                isStatic
                                renderLeadingIcon={(cls) => (
                                    <Icon icon="x-icon" className={cls} />
                                )}
                            />

                            {card?.coverURL && (
                                <div
                                    className={cls.card_details__content__cover}
                                >
                                    <img
                                        className={
                                            cls.card_details__content__cover__image
                                        }
                                        src={card.coverURL}
                                        alt="Image de couverture du tableau"
                                    />
                                </div>
                            )}

                            <div className={cls.card_details__content__grid}>
                                <div>
                                    <TitleSection
                                        onChangeTitle={updateCardTitle}
                                        parentListName={parentListName}
                                        title={card!.title}
                                        editable={canEditCard}
                                    />
                                    <DescriptionSection
                                        onChangeDescription={
                                            updateCardDescription
                                        }
                                        description={card!.description}
                                        editable={canEditCard}
                                    />
                                    <AttachmentSection />
                                    <CommentSection />
                                </div>

                                <ActionSection
                                    currentCoverUrl={card!.coverURL}
                                    editable={canEditCard}
                                    onChangeCover={updateCardCover}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );

    function closeModal() {
        setIsOpen(false);
        navigate(-1);
    }

    function updateCardTitle(newTitle: string) {
        if (board && card) {
            if (newTitle.length > 0 && newTitle !== card.title) {
                changeCardTitleMutation.mutate({
                    oldName: card.title,
                    newName: newTitle,
                    onSuccess: () => {
                        dispatch({
                            type: 'ADD_SUCCESS',
                            key: `board-rename-card-${new Date().getTime()}`,
                            message: 'Card renamed successfully',
                        });
                    },
                    boardId: board.id,
                    cardId: card.id,
                    listId: card.parentListId,
                });
            }
        }
    }

    function updateCardDescription(newDescription: string) {
        if (board && card) {
            if (newDescription !== card.description) {
                changeCardDescriptionMutation.mutate({
                    oldDescription: card.description,
                    newDescription: newDescription,
                    onSuccess: () => {
                        dispatch({
                            type: 'ADD_SUCCESS',
                            key: `board-change-card-description-${new Date().getTime()}`,
                            message: 'Card updated successfully',
                        });
                    },
                    boardId: board.id,
                    cardId: card.id,
                });
            }
        }
    }

    function updateCardCover(photo: Photo | null) {
        if (board && card) {
            changeCardCoverMutation.mutate({
                newCover: photo,
                oldCoverPhotoUrl: card.coverURL,
                listId: card.parentListId,
                onSuccess: () => {
                    dispatch({
                        type: 'ADD_SUCCESS',
                        key: `board-change-card-cover-${new Date().getTime()}`,
                        message: 'Cover updated successfully',
                    });
                },
                boardId: board.id,
                cardId: card.id,
            });
        }
    }
}

function TitleSection({
    title,
    parentListName,
    editable,
    onChangeTitle,
}: {
    title: string;
    parentListName?: string;
    editable: boolean;
    onChangeTitle: (newTitle: string) => void;
}) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [newTitle, setNewTitle] = React.useState(title);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffectNotFirst(() => {
        setNewTitle(title);
    }, [title]);
    useEffectNotFirst(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleChangeTitle = () => {
        setIsEditing(false);
        onChangeTitle(newTitle.trim());
        setNewTitle(newTitle.trim());
    };

    return (
        <section
            className={clsx(cls.title_section, {
                [cls[`title_section--editable`]]: editable,
            })}
        >
            <p
                className={cls.title_section__title}
                onClick={() => setIsEditing(true)}
            >
                {isEditing && editable ? (
                    <Input
                        ref={inputRef}
                        value={newTitle}
                        onChange={setNewTitle}
                        onBlur={handleChangeTitle}
                    />
                ) : (
                    <>{title}</>
                )}
            </p>

            <small className={cls.title_section__subtitle}>
                In list <strong>{parentListName}</strong>
            </small>
        </section>
    );
}

function DescriptionSection({
    editable,
    description,
    onChangeDescription,
}: {
    editable: boolean;
    description: string | null;
    onChangeDescription: (newDescription: string) => void;
}) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [descriptionValue, setDescriptionValue] = React.useState(
        description ?? ''
    );
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    useEffectNotFirst(() => {
        if (isEditing) {
            textAreaRef.current?.focus();
        }
    }, [isEditing]);
    useEffectNotFirst(() => {
        setDescriptionValue(description ?? '');
    }, [description]);

    const handleChangeDescription = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsEditing(false);
        onChangeDescription(descriptionValue.trim());
        setDescriptionValue(descriptionValue.trim());
    };

    return (
        <section className={cls.description_section}>
            <div className={cls.description_section__header}>
                <Icon
                    icon="document"
                    className={cls.description_section__header__icon}
                />
                <small>Description</small>

                {editable && (
                    <Button
                        variant="outline"
                        size="small"
                        className={cls.description_section__header__edit_btn}
                        onClick={() => setIsEditing(true)}
                        renderLeadingIcon={(clsx) => {
                            return <Icon icon="pencil" className={clsx} />;
                        }}
                    >
                        Edit
                    </Button>
                )}
            </div>

            <div className={cls.description_section__description}>
                {isEditing && editable ? (
                    <form
                        className={cls.description_section__description__form}
                        onSubmit={handleChangeDescription}
                    >
                        <TextareaAutogrow
                            className={
                                cls.description_section__description__form__textarea
                            }
                            value={descriptionValue ?? ''}
                            minHeight={50}
                            ref={textAreaRef}
                            placeholder="Add a description (markdown supported)"
                            onChange={setDescriptionValue}
                        />

                        <div
                            className={
                                cls.description_section__description__form__actions
                            }
                        >
                            <Button
                                variant="success"
                                type="submit"
                                className={
                                    cls.description_section__description__form__actions__btn
                                }
                            >
                                Save
                            </Button>

                            <Button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setDescriptionValue(description ?? '');
                                }}
                                className={
                                    cls.description_section__description__form__actions__btn
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : description ? (
                    <article
                        className={cls.description_section__description__text}
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(description),
                        }}
                    />
                ) : (
                    <p className={cls.description_section__description__empty}>
                        No description
                    </p>
                )}
            </div>
        </section>
    );
}

function ActionSection({
    onChangeCover,
    editable,
    currentCoverUrl,
}: {
    onChangeCover: (cover: Photo | null) => void;
    editable: boolean;
    currentCoverUrl: string | null;
}) {
    const [coverDropdownRef, coverDropdownIsOpen, toggleCoverDropdown] =
        useDropdownToggle();

    return (
        <aside className={cls.action_section}>
            <div className={cls.action_section__header}>
                <Icon
                    icon="user"
                    className={cls.action_section__header__icon}
                />
                <small>Actions</small>
            </div>

            <div className={cls.action_section__actions}>
                <div className={cls.action_section__actions__action}>
                    <Button
                        disabled={!editable}
                        alignText={'left'}
                        variant={'hollow'}
                        renderLeadingIcon={(cls) => (
                            <Icon icon={'tag'} className={cls} />
                        )}
                    >
                        Labels
                    </Button>
                </div>

                <div
                    className={cls.action_section__actions__action}
                    ref={coverDropdownRef}
                >
                    <Button
                        disabled={!editable}
                        onClick={toggleCoverDropdown}
                        alignText={'left'}
                        variant={!coverDropdownIsOpen ? 'hollow' : 'black'}
                        renderLeadingIcon={(cls) => (
                            <Icon icon={'media'} className={cls} />
                        )}
                    >
                        Cover
                    </Button>

                    <PhotoSearch
                        show={coverDropdownIsOpen}
                        onSelect={onChangeCover}
                        onDelete={
                            currentCoverUrl
                                ? () => onChangeCover(null)
                                : undefined
                        }
                    />
                </div>

                <div className={cls.action_section__actions__action}>
                    <Button
                        disabled={!editable}
                        alignText={'left'}
                        variant={'danger'}
                        renderLeadingIcon={(cls) => (
                            <Icon icon={'trash'} className={cls} />
                        )}
                    >
                        Delete card
                    </Button>
                </div>
            </div>
        </aside>
    );
}

function AttachmentSection() {
    return <section></section>;
}

function CommentSection() {
    return <section></section>;
}
