const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-white border-t-2 border-secondary py-4 px-6">
            <p className="text-center text-sm font-medium">
                © {currentYear} Vzdělávací kancelář ESA - ESERO Česká republika
            </p>
        </footer>
    );
};

export default Footer;
