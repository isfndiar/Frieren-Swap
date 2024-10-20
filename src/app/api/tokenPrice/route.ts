import { NextRequest, NextResponse } from "next/server";
import Moralis from "moralis";
import cors from "cors";
if (!Moralis.Core.isStarted) {
  Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
}
cors();
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const addressOne = searchParams.get("addressOne") || "";
  const addressTwo = searchParams.get("addressTwo") || "";
  try {
    const tokenOne = await Moralis.EvmApi.token.getTokenPrice({
      address: addressOne,
    });
    const tokenTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTwo,
    });

    const usdPrices = {
      tokenOne: tokenOne.raw.usdPrice,
      tokenTwo: tokenTwo.raw.usdPrice,
      ratio: tokenOne.raw.usdPrice / tokenTwo.raw.usdPrice,
    };
    return NextResponse.json(usdPrices, { status: 200 });
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return NextResponse.json(error);
  }
}
