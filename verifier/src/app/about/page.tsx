import NavBar from "@/components/NavBar"

export default function AboutPage() {
    return (
        <div className="flex flex-col p-8 items-center h-screen">
            <NavBar />
            <h1 className="font-semibold text-3xl">About</h1>
            <p className="text-lg">This is the about page</p>
        </div>
    )
}