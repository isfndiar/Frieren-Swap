"use client";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { priceProps } from "@/lib/types";
import useConnectMetamask from "@/hook/useConnectMetamask";
import HeaderMoved from "./HeaderMoved";
import tokenList from "@/app/tokenList.json";
import SlipPage from "./SlipPage";
import Image from "next/image";
import Modal from "./Modal";

type txDetailsProps = {
  to: `0x${string}` | null | undefined;
  data: `0x${string}` | undefined;
  value: bigint | undefined;
};

const TOKEN_API_INCH = "Bearer " + process.env.NEXT_PUBLIC_API_INCH;

const configHeaders = {
  method: "GET",
  headers: {
    Authorization: TOKEN_API_INCH,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
  },
};
const SwapToken = () => {
  const [tokenOneAmount, setTokenOneAmount] = useState<string>("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("0.5");
  const [openSlippage, setOpenSlippage] = useState<boolean>(false);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [prices, setPrices] = useState<priceProps | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [changeToken, setChangeToken] = useState<number>(1);
  const { isConnected, address } = useAccount();
  const [txDetails, setTxDetails] = useState<txDetailsProps>({
    to: null,
    data: undefined,
    value: undefined,
  });
  const { connect, connector, hydration } = useConnectMetamask();
  const { sendTransaction, data } = useSendTransaction();
  const { isError, isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });
  console.log(isSuccess, isError, isLoading);
  const switchToken = () => {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOneAmount("");
    setTokenTwoAmount("");
    setTokenOne(two);
    setTokenTwo(one);
    getTokenPrice(tokenTwo.address, tokenOne.address);
  };
  const handleSlippage = (e: string) => {
    setSlippage(e);
    setOpenSlippage(false);
  };

  const changeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setTokenOneAmount(value);
    if (value == "" || (value == undefined && prices)) {
      setTokenTwoAmount("0");
    } else if (value && prices) {
      setTokenTwoAmount((parseFloat(value) * prices.ratio).toFixed(2));
    }
  };
  const fetchDexSwap = async () => {
    if (isConnected && hydration) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/api/swap`,
          {
            method: "POST",
            body: JSON.stringify({ tokenOne, address }),
          }
        );

        const response = await res.json();
        if (response.allowance == 0) {
          const resApprove = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/api/allowance`,
            {
              method: "POST",
              body: JSON.stringify({ tokenOne }),
            }
          );
          const approve = await resApprove.json();
          sendTransaction({
            to: approve.to,
            data: approve.data,
            value: approve.value,
          });
          console.log("Not Approve");
          return;
        }

        const resTx = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/api/swapToken`,
          {
            method: "POST",
            body: JSON.stringify({
              tokenOne,
              tokenTwo,
              tokenOneAmount,
              address,
              slippage,
            }),
          }
        );
        const { tx } = await resTx.json();
        const decimals = Number(`1E${tokenTwo.decimals}`);

        setTokenTwoAmount(
          (Number(tx.data.toTokenAmount) / decimals).toFixed(2)
        );
        setTxDetails(tx.data.tx);
      } catch (error) {
        console.log(error);
        toast.error(` many to request. please comeback after few hours`, {
          position: "top-center",
        });
      }
    } else {
      connect({ connector });
    }
  };

  const openModal = (asset: number) => {
    setChangeToken(asset);
    setIsOpen(true);
  };

  const modify = (e: number) => {
    setPrices(null);
    setTokenOneAmount("");
    setTokenTwoAmount("");
    if (changeToken === 1) {
      setTokenOne(tokenList[e]);
      setIsOpen(false);
      getTokenPrice(tokenList[e].address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[e]);
      setIsOpen(false);
      getTokenPrice(tokenOne.address, tokenList[e].address);
    }
  };

  async function getTokenPrice(addressOne: string, addressTwo: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/api/tokenPrice?addressOne=${addressOne}&addressTwo=${addressTwo}`,
      configHeaders
    );

    const data: priceProps = await response.json();

    setPrices(data);
  }

  /**
   * @description if token change, get token price will excecute
   */
  useEffect(() => {
    getTokenPrice(tokenOne.address, tokenTwo.address);
  }, [tokenOne, tokenTwo]);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction({
        to: txDetails.to,
        data: txDetails.data,
        value: txDetails.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txDetails, isConnected]);

  return (
    <>
      <HeaderMoved />
      <Modal
        open={isOpen}
        setIsOpen={setIsOpen}
        tokenList={tokenList}
        handleClick={(e) => modify(e)}
      />

      <div className="w-[35rem] text-white h-10">
        <SlipPage
          handleSlippage={handleSlippage}
          slippage={slippage}
          open={openSlippage}
          setOpen={setOpenSlippage}
        />
        {/* token 1 */}
        <div className="w-full rounded-lg bg-input-dark py-4 pb-8 px-4  mt-2 font-mono">
          <Header />
          <main className="flex w-full justify-between items-center mt-3 ">
            <Input
              name="tokenOne"
              placeholder="0"
              value={tokenOneAmount || ""}
              disabled={!prices}
              onChange={changeAmount}
              className="input-token "
            />
            <div
              onClick={() => openModal(1)}
              className="flex gap-2  justify-center items-center group cursor-pointer"
            >
              <Image
                width={30}
                height={30}
                src={tokenOne.img}
                alt={tokenOne.name}
                className="object-cover"
              />
              <span className="text-xl">{tokenOne.ticker}</span>
              <ChevronDown />
            </div>
          </main>
        </div>
        {/* rotate componnetnt */}
        <RotateToken onClick={switchToken} />
        {/* token 2 */}
        <div className="w-full rounded-lg bg-input-dark py-4 pb-8 px-4 font-mono">
          <main className="flex justify-between items-center mt-3">
            <Input
              placeholder="0"
              value={tokenTwoAmount || ""}
              disabled={true}
              className="input-token"
            />
            <div
              onClick={() => openModal(2)}
              className="flex gap-2  justify-center items-center group cursor-pointer"
            >
              <Image
                width={30}
                height={30}
                src={tokenTwo.img}
                alt={tokenTwo.name}
                className="object-cover"
              />
              <span className="text-xl">{tokenTwo.ticker}</span>
              <ChevronDown />
            </div>
          </main>
        </div>

        <Button
          disabled={isConnected && hydration && !tokenOneAmount}
          onClick={fetchDexSwap}
          className="w-full py-8 mt-7 rounded-lg  transition-all bg-green-leaf hover:bg-green-leaf text-green-tea text-xl border border-transparent hover:border-green-tea"
        >
          {isConnected && hydration ? "Buy" : "Connect Wallet"}
        </Button>
      </div>
    </>
  );
};

const Header = () => {
  return (
    <header>
      <span>{`You're`} Selling</span>
      {/* balance token */}
      {/* set max token */}
    </header>
  );
};

const RotateToken = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full flex justify-center  my-2">
      <ArrowDownUp
        size={20}
        onClick={onClick}
        className="size-7 p-1 rounded-full  bg-input-black hover:cursor-pointer transition-all border border-transparent hover:border hover:border-[#C7F284]"
      />
    </div>
  );
};

export default SwapToken;
