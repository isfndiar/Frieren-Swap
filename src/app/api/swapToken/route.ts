import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const TOKEN_API_INCH = "Bearer " + process.env.NEXT_PUBLIC_API_INCH;
// const configHeaders = {
//   method: "GET",
//   headers: {
//     Authorization: TOKEN_API_INCH,
//     "Access-Control-Allow-Origin": "*", // Allow all origins
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
//     "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
//   },
// };

type ApproveSwap = {
  tokenOne: {
    ticker: string;
    img: string;
    name: string;
    address: string;
    decimals: number;
  };
  tokenTwo: {
    ticker: string;
    img: string;
    name: string;
    address: string;
    decimals: number;
  };
  address: `0x${string}` | undefined;
  slippage: string;
  tokenOneAmount: string;
};
export async function POST(req: NextRequest) {
  const response = (await req.json()) as ApproveSwap;
  const { tokenOne, address, slippage, tokenOneAmount, tokenTwo } = response;
  const tx = await axios.get(`https://api.1inch.dev/swap/v6.0/1/swap`, {
    headers: {
      Authorization: TOKEN_API_INCH,
    },
    params: {
      src: tokenOne.address,
      dst: tokenTwo.address,
      amount: tokenOneAmount.padEnd(
        tokenOne.decimals + tokenOneAmount.length,
        "0"
      ),
      from: address,
      origin: address,
      slippage: slippage,
    },
  });
  console.log(tx.data);
  return NextResponse.json({});
}
