"use client";
import { Dispatch, SetStateAction } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type slippageProps = {
  slippage: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleSlippage: (e: string) => void;
};
const SlipPage = ({
  slippage,
  open,
  setOpen,
  handleSlippage,
}: slippageProps) => {
  const handleOpen = () => {
    setOpen((x) => !x);
  };

  return (
    <div className="flex justify-end mt-2 relative ">
      <Settings
        size={20}
        onClick={handleOpen}
        className={cn(
          "hover:rotate-90 hover:text-slate-200 transition-transform data-[state=on]:rotate-90"
        )}
      />

      <div
        className={cn(
          open
            ? " absolute top-7 -right-32 bg-input-dark border border-green-tea shadow-2xl w-[20rem] flex flex-col items-center px-1 py-4 "
            : "hidden"
        )}
      >
        <header className="mb-7">Slippage</header>
        <ToggleGroup
          type="single"
          value={slippage}
          onValueChange={handleSlippage}
        >
          <ToggleGroupItem value={"0.5"} aria-label="Toggle bold">
            0.5%
          </ToggleGroupItem>
          <ToggleGroupItem value={"2.5"} aria-label="Toggle italic">
            2.5%
          </ToggleGroupItem>
          <ToggleGroupItem value={"5.0"} aria-label="Toggle underline">
            5.0%
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default SlipPage;
