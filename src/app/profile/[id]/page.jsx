const UserProfile = ({ params }) => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen py-2">
            Profile
            <p className="text-4xl">
                Profile Page{" "}
                <span className="p-2 ml-2 rounded bg-orange-400 text-black">
                    {params.id}
                </span>
            </p>
        </div>
    );
};

export default UserProfile;
