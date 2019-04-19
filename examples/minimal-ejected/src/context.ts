import { yogaContext } from '@atto-byte/yoga';

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

export interface Context {
  users: UserModel[]
}

export default yogaContext(() => ({
  users,
}))
