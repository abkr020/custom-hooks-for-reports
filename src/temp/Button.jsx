import React from 'react'
import { useState } from 'react';

const Button = ({
    onClick, lable = "click me"
}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        console.log("button click");

        if (loading) return;

        setLoading(true);

        // let browser paint loading UI first
        // await new Promise((resolve) => setTimeout(resolve, 0));

        // await new Promise((resolve) => {
        //     requestAnimationFrame(() => {
        //         resolve();
        //     });
        // });

        await new Promise((resolve) => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            resolve();
        });
    });
});

        try {
            await onClick?.(e);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? "Loading..." : lable}
        </button>
    )
}

export default Button
