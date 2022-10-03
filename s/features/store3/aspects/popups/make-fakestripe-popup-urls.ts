
export namespace makeFakestripePopupUrl {

	export function connect(params: {
			return_url: string
			refresh_url: string
		}) {
		return `/mocksite/fakestripe/connect`
			+ `?return_url=${encodeURIComponent(params.return_url)}`
			+ `&refresh_url=${encodeURIComponent(params.refresh_url)}`
	}

	export function login() {
		return `/mocksite/fakestripe/login`
	}

	export function customerPortal() {
		return `/mocksite/fakestripe/store-customer-portal`
	}

	export function checkout(params: {
			success_url: string
			cancel_url: string
		}) {
		return `/mocksite/fakestripe/checkout`
			+ `?success_url=${encodeURIComponent(params.success_url)}`
			+ `&cancel_url=${encodeURIComponent(params.cancel_url)}`
	}

	export function checkoutPaymentMethod(params: {
			success_url: string
			cancel_url: string
		}) {
		return `/mocksite/fakestripe/checkout-payment-method`
			+ `?success_url=${encodeURIComponent(params.success_url)}`
			+ `&cancel_url=${encodeURIComponent(params.cancel_url)}`
	}
}
