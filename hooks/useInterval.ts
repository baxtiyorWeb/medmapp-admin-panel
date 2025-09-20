// hooks/useInterval.ts
"use client";

import { useEffect, useRef } from 'react';

type Callback = () => void;

export function useInterval(callback: Callback, delay: number | null) {
    const savedCallback = useRef<Callback>(null);

    // Eng so'nggi callbackni saqlab qo'yamiz.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Intervalni o'rnatamiz.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}