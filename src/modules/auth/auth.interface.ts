export interface ISingupUser {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}
