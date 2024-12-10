import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    maxScoreEurope: {
        type: Number,
        default: 0,
    },
    maxScoreAmericas: {
        type: Number,
        default: 0,
    },
    maxScoreAsiaOceania: {
        type: Number,
        default: 0,
    },
    maxScoreAfricaMe: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
