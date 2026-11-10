export type Admin = {
  id: string
  name: string
  email: string
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginResult = {
  token: string
  admin: Admin
}
