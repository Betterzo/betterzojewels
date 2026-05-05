/**
 * Single source for store currency. UI, Razorpay `currency`, and checkout/verify
 * API bodies use `APP_CURRENCY.code` — backend Razorpay orders must match.
 */
export const APP_CURRENCY = {
  code: 'USD' as const,
  locale: 'en-US',
};

/** Same unit as product prices from your API (major units, e.g. dollars not cents). */
export const FREE_SHIPPING_MIN_ORDER_AMOUNT = 50;

export function formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(APP_CURRENCY.locale, {
    style: 'currency',
    currency: APP_CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/** Product cards, sliders — no fraction digits. */
export function formatCurrencyWhole(amount: number): string {
  return formatCurrency(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function freeShippingMetaFragment(): string {
  return `Free shipping on orders over ${formatCurrency(FREE_SHIPPING_MIN_ORDER_AMOUNT)}.`;
}
