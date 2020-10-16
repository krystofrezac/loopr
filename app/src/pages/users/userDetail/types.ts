export type User =
  | {
      id: string;
      name: string;
      username: string;
      role: {
        id: string;
        name: string;
      };
    }
  | null
  | undefined;

export interface UserDetailProps {
  loading: boolean;
  user: User;
}
