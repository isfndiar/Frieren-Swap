type priceProps = { addressOne: number; addressTwo: number; ratio: number };
type FetchApiResponse<T> = {
  message: string;
  data: T;
  status: boolean;
};

type TokenListProps = {
  address: string;
  decimals: number;
  img: string;
  name: string;
  ticker: string;
};

export type { FetchApiResponse, TokenListProps, priceProps };
