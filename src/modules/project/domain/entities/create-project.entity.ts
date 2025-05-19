export class Project {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly published: boolean,
    public readonly isFeatured: boolean,
    public readonly implementCity: string,
    public readonly categoryId: number,
  ) {}
}
