import { data, Data } from './data'

export interface Context {
  data: Data
}

export default () => ({
  data,
})
