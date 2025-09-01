/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/(components)/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#03B7F0",
                secondary: "#024F6D",
                dark: "#030813",
            },
            scrollbar: {
                hidden: {
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style":
                        "none" /* For Internet Explorer and Edge */,
                    "scrollbar-width": "none" /* For Firefox */,
                },
            },
        },
    },
    plugins: [],
    purge: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/(components)/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
};
