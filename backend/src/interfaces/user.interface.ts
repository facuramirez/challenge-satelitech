export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: "admin" | "user";
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
