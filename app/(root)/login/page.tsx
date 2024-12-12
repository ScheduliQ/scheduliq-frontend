import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Image
        src="/logo.png"
        alt="logo"
        width={450}
        height={250}
        className="pb-14 ml-4"
      />
      <h1 className="text-2xl font-bold mb-4 text-black">Login</h1>
      <form className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-md"
        />
        <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
    </main>
  );
}
