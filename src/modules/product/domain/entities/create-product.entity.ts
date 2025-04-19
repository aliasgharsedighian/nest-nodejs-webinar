export class Product {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly images: string[],
    public readonly stock: number,
    public readonly show: boolean,
    public readonly categories: number[],
  ) {}
}
