export interface User {
  email: string;
  role: string;
  firstname: string;
  lastname: string;
}
export type Users = User[];

export interface UserWithId extends User {
  id: number;
  error?: boolean;
}
export type UsersWithId = UserWithId[];

export type RolesLookup = Record<string, string>;
export interface UserImportTableProps {
  users?: Users;
}

export interface UserImportTableUIProps {
  users: UsersWithId;
  rolesLookup: RolesLookup;
  loading: boolean;
  onRowAdd: (user: User) => void;
  onRowUpdate: (user: UserWithId) => void;
  onRowDelete: (user: UserWithId) => void;
  onSelectionChange: (users: UsersWithId) => void;
  onSubmit: () => void;
}
