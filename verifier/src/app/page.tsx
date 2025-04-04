
import NavBar from "@/components/NavBar";

export default function Home() {


  return (
    <div className="flex flex-col items-center p-8 w-full">
      <NavBar />

      <div className="flex flex-col gap-3 p-8 bg-zinc-800 rounded-md">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold">Verifier</h1>
          <p className="text-lg">Verifier is a simple e-commerce website that allows you to buy products.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold">Features</h1>
          <p className="text-lg">Verifier has the following features:</p>
          <ul className="list-disc list-inside">
            <li className="text-lg">Shop for products</li>
            <li className="text-lg">Add products to your cart</li>
            <li className="text-lg">View your cart</li>
            <li className="text-lg">Clear your cart</li>
            <li className="text-lg">View your profile</li>
            <li className="text-lg">Log out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
