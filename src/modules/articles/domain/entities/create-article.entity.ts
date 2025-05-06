export class Article {
  constructor(
    public readonly title: string,
    public readonly slug: string,
    public readonly excerpt: string,
    // public readonly images: string[],
    public readonly body: string,
    public readonly published: boolean,
    public readonly categoryId: number,
  ) {}
}
