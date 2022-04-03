import * as React from 'react';
// functions and other
import type { FormEvent } from 'react';
import { clsx, renderMarkdown } from '@/lib/functions';
import { useNavigate } from 'react-router-dom';
import { useDropdownToggle, useEffectNotFirst } from '@/lib/hooks';
import { useCardDetailsData } from '@/lib/page-hooks';
import {
    useAddLabelToCardMutation,
    useChangeCardCoverMutation,
    useChangeCardDescriptionMutation,
    useChangeCardTitleMutation,
    useRemoveLabelFromCardMutation,
} from '@/lib/queries';
import type { Color, Label, PartialOmit, Photo } from '@/lib/types';

// components
import { Modal } from '@/components/modal';
import { Seo } from '@/components/seo';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { Loader } from '@/components/loader';
import { TextareaAutogrow } from '@/components/textarea-autogrow';
import { Input } from '@/components/input';
import { PhotoSearch } from '@/components/photo-search';
import { Tag } from '@/components/tag';
import { LabelSelector } from '@/components/label-selector';

// styles
import cls from '@/styles/pages/dashboard/card.module.scss';

export interface CardDetailsProps {}

export function CardDetails({}: CardDetailsProps) {
    // global data
    const { board, card, canEditCard, parentListName, isLoading } =
        useCardDetailsData();
    const navigate = useNavigate();

    // mutations
    const changeCardTitleMutation = useChangeCardTitleMutation();
    const changeCardDescriptionMutation = useChangeCardDescriptionMutation();
    const changeCardCoverMutation = useChangeCardCoverMutation();
    const addLabelToCardMutation = useAddLabelToCardMutation();
    const removeLabelFromCardMutation = useRemoveLabelFromCardMutation();

    // state & ref
    const [isOpen, setIsOpen] = React.useState(true);
    const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

    if (!board) {
        return <></>;
    }

    if (!isLoading && !card) {
        closeModal();
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
                                        onChangeTitle={updateTitle}
                                        onRemoveLabel={removeLabel}
                                        parentListName={parentListName}
                                        title={card!.title}
                                        editable={canEditCard}
                                        labels={card!.labels}
                                    />
                                    <DescriptionSection
                                        onChangeDescription={updateDescription}
                                        description={card!.description}
                                        editable={canEditCard}
                                    />
                                    <AttachmentSection />
                                    <CommentSection />
                                </div>

                                <ActionSection
                                    onSelectLabel={addLabel}
                                    availableLabels={board.labels}
                                    currentCoverUrl={card!.coverURL}
                                    editable={canEditCard}
                                    onChangeCover={updateCover}
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

    function updateTitle(newTitle: string) {
        if (board && card) {
            if (newTitle.length > 0 && newTitle !== card.title) {
                changeCardTitleMutation.mutate({
                    oldName: card.title,
                    newName: newTitle,
                    boardId: board.id,
                    cardId: card.id,
                    listId: card.parentListId,
                });
            }
        }
    }

    function updateDescription(newDescription: string) {
        if (board && card) {
            if (newDescription !== card.description) {
                changeCardDescriptionMutation.mutate({
                    oldDescription: card.description,
                    newDescription: newDescription,
                    boardId: board.id,
                    cardId: card.id,
                });
            }
        }
    }

    function updateCover(photo: Photo | null) {
        if (board && card) {
            changeCardCoverMutation.mutate({
                newCover: photo,
                oldCoverPhotoUrl: card.coverURL,
                listId: card.parentListId,
                boardId: board.id,
                cardId: card.id,
            });
        }
    }

    function addLabel({
        id,
        name,
        color,
    }: {
        id: string | null;
        name: string;
        color: Color;
    }) {
        if (board && card) {
            addLabelToCardMutation.mutate({
                labelId: id,
                labelName: name,
                labelColor: color,
                boardId: board.id,
                cardId: card.id,
                listId: card.parentListId,
            });
        }
    }

    function removeLabel(label: Label) {
        if (board && card) {
            removeLabelFromCardMutation.mutate({
                boardId: board.id,
                cardId: card.id,
                listId: card.parentListId,
                label,
            });
        }
    }
}

function TitleSection({
    title,
    parentListName,
    editable,
    onChangeTitle,
    labels,
    onRemoveLabel,
}: {
    title: string;
    parentListName?: string;
    editable: boolean;
    labels: PartialOmit<Label, 'id'>[];
    onChangeTitle: (newTitle: string) => void;
    onRemoveLabel: (label: Label) => void;
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

            {labels.length > 0 && (
                <div className={cls.title_section__labels}>
                    <div className={cls.title_section__labels__header}>
                        <Icon
                            icon="tag"
                            className={cls.title_section__labels__header__icon}
                        />
                        <small>Labels</small>
                    </div>

                    <ul className={cls.title_section__labels__list}>
                        {labels.map((label) => (
                            <>
                                <Tag
                                    disabled={!label.id}
                                    onRemove={() =>
                                        label.id &&
                                        onRemoveLabel(label as Label)
                                    }
                                    color={label.color}
                                    text={label.name}
                                    rounded={false}
                                />
                            </>
                        ))}
                    </ul>
                </div>
            )}
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
    availableLabels,
    onSelectLabel,
}: {
    onChangeCover: (cover: Photo | null) => void;
    editable: boolean;
    currentCoverUrl: string | null;
    availableLabels: Label[];
    onSelectLabel: (label: {
        id: string | null;
        color: Color;
        name: string;
    }) => void;
}) {
    const [coverDropdownRef, coverDropdownIsOpen, toggleCoverDropdown] =
        useDropdownToggle();

    const [labelDropdownRef, labelDropdownIsOpen, toggleLabelDropdown] =
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

                <div
                    className={cls.action_section__actions__action}
                    ref={labelDropdownRef}
                >
                    <Button
                        disabled={!editable}
                        alignText={'left'}
                        variant={!labelDropdownIsOpen ? 'hollow' : 'black'}
                        onClick={toggleLabelDropdown}
                        renderLeadingIcon={(cls) => (
                            <Icon icon={'tag'} className={cls} />
                        )}
                    >
                        Labels
                    </Button>

                    {labelDropdownIsOpen && (
                        <LabelSelector
                            availableLabels={availableLabels}
                            onSelect={onSelectLabel}
                        />
                    )}
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
