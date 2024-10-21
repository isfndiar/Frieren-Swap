import { ArrowDownUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { ChangeEvent } from "react";

type priceProps = {
  addressOne: number;
  addressTwo: number;
  ratio: number;
};
type TokenListProps = {
  ticker: string;
  img: string;
  name: string;
  address: string;
  decimals: number;
};
type TokenOneProps = {
  tokenOneAmount: string;
  changeAmount: (e: ChangeEvent<HTMLInputElement>) => void;
  prices: priceProps | null | undefined;
  handleModal: () => void;
  tokenOne: TokenListProps;
};

type TokenTwoProps = {
  tokenTwoAmount: string;
  handleModal: () => void;
  tokenTwo: TokenListProps;
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

export const TokenOne = (props: TokenOneProps) => {
  const {
    changeAmount,
    handleModal,
    prices = null,
    tokenOne,
    tokenOneAmount,
  } = props;
  return (
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
          onClick={handleModal}
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
  );
};

export const TokenTwo = (props: TokenTwoProps) => {
  const { handleModal, tokenTwo, tokenTwoAmount } = props;
  return (
    <div className="w-full rounded-lg bg-input-dark py-4 pb-8 px-4 font-mono">
      <main className="flex justify-between items-center mt-3">
        <Input
          placeholder="0"
          value={tokenTwoAmount || ""}
          disabled={true}
          className="input-token"
        />
        <div
          onClick={handleModal}
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
  );
};

export const TokenSwitchButton = ({ onClick }: { onClick: () => void }) => {
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
