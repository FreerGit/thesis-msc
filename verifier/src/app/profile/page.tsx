import LogOutButton from "@/components/LogOutButton";
import NavBar from "@/components/NavBar";

export default function ProfilePage() {

    return (
        <div className="flex flex-col p-8 items-center h-screen">
            <NavBar />
            <h1 className="font-semibold text-3xl">Profile</h1>
            <p className="text-lg">This is the profile page</p>

            <LogOutButton></LogOutButton>
        </div>
    )
}