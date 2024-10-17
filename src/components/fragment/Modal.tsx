import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TokenListProps } from "@/lib/types";
import Image from "next/image";
const Modal = ({
  open,
  setIsOpen,
  tokenList,
  handleClick,
}: {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  tokenList: TokenListProps[];
  handleClick: (e: number) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="bg-input-dark text-white p-0 overflow-y-auto scroll-style">
        <DialogHeader>
          <DialogTitle className="py-5 px-3">Select a Token</DialogTitle>
          <DialogDescription className="flex flex-col w-full  ">
            {tokenList.map((item, e) => (
              <div
                key={e}
                onClick={() => handleClick(e)}
                className="w-full flex items-center text-xl gap-2 py-2 px-3 hover:bg-slate-200"
              >
                <Image
                  width={50}
                  height={50}
                  alt={item.ticker}
                  src={item.img}
                />
                <div>{item.ticker}</div>
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
