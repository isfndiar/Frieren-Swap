import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const TOKEN_API_INCH = "Bearer " + process.env.NEXT_PUBLIC_API_INCH;
const configHeaders = {
  method: "GET",
  headers: {
    Authorization: TOKEN_API_INCH,
  },
};

type ApproveSwap = {
  tokenOne: {
    address: string;
  };
};
export async function POST(req: NextRequest) {
  const response = (await req.json()) as ApproveSwap;
  const { tokenOne } = response;
  const approve = await axios.get(
    `https://api.1inch.dev/swap/v6.0/1/approve/transaction?tokenAddress=${tokenOne.address}`,
    configHeaders
  );
  const data = approve.data;
  return NextResponse.json(data);
}
