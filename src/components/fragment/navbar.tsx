import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src={"/frieren.jpg"}
            alt="logo"
            width={500}
            height={500}
            loading="lazy"
            className="size-14   rounded-full "
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Frieren Swap
          </span>
        </Link>
        <ConnectWallet />
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <div className="flex  p-0  font-bold  md:space-x-8 ">
            <Link
              href="/"
              className="block py-2 px-3  rounded hover:bg-slate-800 p-1"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 px-3  rounded hover:bg-slate-800 p-1"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 px-3  rounded hover:bg-slate-800 p-1"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
