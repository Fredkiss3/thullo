import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import cls from '../styles/components/modal.module.scss';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelButtonRef?: React.RefObject<HTMLButtonElement>;
    className?: string;
    children: React.ReactNode;
}

export function Modal({
    isOpen,
    onClose,
    children,
    className,
    cancelButtonRef,
}: ModalProps) {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className={cls.modal}
                    onClose={onClose}
                    initialFocus={cancelButtonRef}
                >
                    <div className={cls.modal__backdrop}>
                        {/* Overlay with transition */}
                        <Transition.Child
                            as={Fragment}
                            enter={cls.modal__overlay__enter}
                            enterFrom={cls.modal__overlay__enterFrom}
                            enterTo={cls.modal__overlay__enterTo}
                            leave={cls.modal__overlay__leave}
                            leaveFrom={cls.modal__overlay__leaveFrom}
                            leaveTo={cls.modal__overlay__leaveTo}
                        >
                            <Dialog.Overlay className={cls.modal__overlay} />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className={cls.modal__zeroWidthSpace}
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        {/* Content */}
                        <Transition.Child
                            as={Fragment}
                            enter={cls.modal__content__enter}
                            enterFrom={cls.modal__content__enterFrom}
                            enterTo={cls.modal__content__enterTo}
                            leave={cls.modal__content__leave}
                            leaveFrom={cls.modal__content__leaveFrom}
                            leaveTo={cls.modal__content__leaveTo}
                        >
                            {/* Modal container */}
                            <div
                                className={`${className ?? ''} ${
                                    cls.modal__content
                                }`}
                            >
                                {/* modal content */}
                                {children}
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
