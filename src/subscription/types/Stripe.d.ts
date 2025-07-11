type StripeId = {
	[key: string]: string;
};

type StripePrices = {
	[key: string]: StripePrice;
};

type StripePrice = {
	stripe: number;
};
