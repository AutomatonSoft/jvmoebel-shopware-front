export type CmsContractIssue = Readonly<{
  message: string;
  path: string;
}>;

export type CmsContractResult<T> = Readonly<{
  data: T | null;
  issues: readonly CmsContractIssue[];
}>;
