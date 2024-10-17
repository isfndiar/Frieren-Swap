import Navbar from "@/components/fragment/navbar";
import SwapToken from "@/components/fragment/SwapToken";
export default async function Home() {
  return (
    <div>
      <Navbar />
      <div className="  w-full pt-20 flex flex-col items-center  justify-center ">
        <SwapToken />
      </div>
    </div>
  );
}
