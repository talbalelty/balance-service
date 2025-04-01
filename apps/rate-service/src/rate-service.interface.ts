export interface RateServiceInterface {
    getRates(coins: string, currency: string): Promise<object>;
}