import { Dictionary } from '@space-truckers/types'
import { getDbRef } from '../core/util'

export class LoginDBSchema {
  static create(path: string) {
    return getDbRef(['logins', path], this.defaultData)
  }
  static defaultData: LoginDBSchema = {
    posts: [],
    message: [],
    xxdd: []
  }
  constructor(
    public posts: Dictionary<any>,
    public message: Array<string>,
    public xxdd: Array<string>
  ) {
  }
}

