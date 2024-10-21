"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { TokenSwitchButton, TokenOne, TokenTwo } from "./TokenComponents";
import { priceProps } from "@/lib/types";
import { Button } from "../ui/button";
import { toast } from "sonner";
import AnimatedHeaderText from "./AnimatedHeaderText";
import useConnectMetamask from "@/hook/useConnectMetamask";
import tokenList from "@/app/tokenList.json";
import SlipPage from "./SlipPage";
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
  const { sendTransaction, isError, isSuccess, isPending } =
    useSendTransaction();

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
    // Regex hanya menerima angka, titik, dan koma
    const regex = /^[0-9.,]*$/;
    // Mengecek apakah input sesuai dengan regex
    if (!regex.test(value)) {
      toast.error("Input must be number");
      return; // Jika tidak sesuai, hentikan eksekusi
    }
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

  useEffect(() => {
    if (isPending) {
    }
  }, [isPending]);
  useEffect(() => {
    if (isError) {
      toast.error("User Reject Request");
    }
  }, [isError]);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Confirmed");
    }
  }, [isSuccess]);

  return (
    <>
      <AnimatedHeaderText />
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
        <TokenOne
          handleModal={() => openModal(1)}
          changeAmount={changeAmount}
          prices={prices}
          tokenOne={tokenOne}
          tokenOneAmount={tokenOneAmount}
        />
        <TokenSwitchButton onClick={switchToken} />
        <TokenTwo
          handleModal={() => openModal(2)}
          tokenTwo={tokenTwo}
          tokenTwoAmount={tokenTwoAmount}
        />
        <Button
          disabled={!isConnected || !hydration || !tokenOneAmount || isPending}
          onClick={fetchDexSwap}
          className="w-full py-8 mt-7 rounded-lg  transition-all bg-green-leaf hover:bg-green-leaf text-green-tea text-xl border border-transparent hover:border-green-tea"
        >
          {isConnected && hydration
            ? "Buy"
            : isPending
            ? "Loading"
            : "Connect Wallet"}
        </Button>
      </div>
    </>
  );
};

export default SwapToken;
