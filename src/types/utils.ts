// eslint-disable-next-line @typescript-eslint/naming-convention
export type AllRequired<Type> = {
  [Key in keyof Type]-?: AllRequired<NonNullable<Type[Key]>>;
};
