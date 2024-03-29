import { RefObject, useEffect, useRef, useState, useCallback } from 'react';
import * as React from 'react';

function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void
): void;

function useEventListener<
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement | void = void
>(
    eventName: KW | KH,
    handler: (
        event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event
    ) => void,
    element?: RefObject<T>
) {
    // Create a ref that stores handler
    const savedHandler = useRef<typeof handler>();

    useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current || window;
        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }

        // Update saved handler if necessary
        if (savedHandler.current !== handler) {
            savedHandler.current = handler;
        }

        // Create event listener that calls handler function stored in ref
        const eventListener: typeof handler = (event) => {
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!savedHandler?.current) {
                savedHandler.current(event);
            }
        };

        targetElement.addEventListener(eventName, eventListener);

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element, handler]);
}

type Handler = (event: MouseEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
    useEventListener(mouseEvent, (event) => {
        const el = ref?.current;

        // Do nothing if clicking ref's element or descendent elements
        if (!el || el.contains(event.target as Node)) {
            return;
        }

        handler(event);
    });
}

export function useDropdownToggle(): [
    ref: RefObject<any>,
    isOpen: boolean,
    toggle: () => void
] {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = React.useRef(null);
    useOnClickOutside(dropdownRef, () => {
        setShowDropdown(false);
    });

    return [
        dropdownRef,
        showDropdown,
        () => {
            setShowDropdown(!showDropdown);
        },
    ];
}

/**
 * A hook that returns a callback function that can be used to
 * toggle the state of a boolean value.
 * @param initialState
 */
export function useToggle(
    initialState: boolean = false
): [boolean, () => void] {
    // Initialize the state
    const [state, setState] = useState<boolean>(initialState);

    // Define and memorize toggler function in case we pass down the component,
    // This function change the boolean value to it's opposite value
    const toggle = useCallback((): void => setState((state) => !state), []);
    return [state, toggle];
}

/**
 * Hook utilisé pour lancer un useEffect mais pas au premier rendu
 *
 * @param effect
 * @param deps
 */
export function useEffectNotFirst<TEffectFn extends Function>(
    effect: TEffectFn,
    deps: any[]
) {
    const isNotFirstRender = useRef(false);

    useEffect(() => {
        if (!isNotFirstRender.current) {
            isNotFirstRender.current = true;
            return;
        }

        effect();
    }, deps);
}
