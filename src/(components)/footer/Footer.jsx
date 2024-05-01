const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-2 px-4">
            <p className="text-center text-sm">
                © {currentYear} Find Where on Earth
            </p>
        </footer>
    );
};

export default Footer;
