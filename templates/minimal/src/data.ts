interface UserModel {
  id: string
  name: string
}

const users: UserModel[] = [
  {
    id: '1',
    name: 'Foo',
  },
  {
    id: '2',
    name: 'Bar',
  },
  {
    id: '3',
    name: 'John',
  },
]

export interface Data {
  users: UserModel[]
}

export const data = {
  users,
}
