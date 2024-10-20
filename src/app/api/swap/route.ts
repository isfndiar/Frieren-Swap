import { NextRequest, NextResponse } from "next/server";

const TOKEN_API_INCH = "Bearer " + process.env.NEXT_PUBLIC_API_INCH;
const configHeaders = {
  method: "GET",
  headers: {
    Authorization: TOKEN_API_INCH,
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
  },
};

type RequestSwap = {
  tokenOne: {
    ticker: string;
    img: string;
    name: string;
    address: string;
    decimals: number;
  };
  address: `0x${string}` | undefined;
};
export async function POST(req: NextRequest) {
  const response = (await req.json()) as RequestSwap;
  const { address, tokenOne } = response;

  const fetchSwap = await fetch(
    `https://api.1inch.dev/swap/v6.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`,
    configHeaders
  );
  const responseSwap = await fetchSwap.json();
  return NextResponse.json(responseSwap);
}
