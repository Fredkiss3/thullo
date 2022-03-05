import * as React from 'react';
import { Fragment, useRef } from 'react';
import { useOnClickOutside } from '@/lib/hooks';
import { Transition } from '@headlessui/react';

// styles
import cls from '@/styles/components/drawer.module.scss';

export interface DrawerMenuProps {
    open: boolean;
    onClose?: () => void;
}

export function Drawer({ open, onClose }: DrawerMenuProps) {
    const ref = useRef(null);

    const handleClickOutside = () => {
        // Your custom logic here
        onClose && onClose();
    };

    useOnClickOutside(ref, handleClickOutside);

    return (
        <div
            className={`lg:hidden ${
                open ? 'block' : 'hidden'
            } fixed inset-0 h-screen bg-secondary-100 bg-opacity-75`}
        >
            <div ref={ref}>
                {/* Menu */}
                <Transition
                    as={Fragment}
                    show={open}
                    appear={open}
                    enter="transition-transform duration-200"
                    enterFrom="translate-x-full opacity-0"
                    enterTo="translate-x-0 opacity-100"
                >
                    <nav
                        className={`absolute top-0 bottom-0 right-0 flex max-w-max bg-white p-4`}
                    >
                        <ul className={`flex flex-col gap-2`}></ul>
                    </nav>
                </Transition>
            </div>
        </div>
    );
}
