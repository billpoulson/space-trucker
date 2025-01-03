export class UserInfoObject {
  constructor(
    public sub: string,
    public given_name: string,
    public family_name: string,
    public nickname: string,
    public name: string,
    public picture: string,
    public updated_at: string,
    public email: string,
    public email_verified: boolean
  ) {
  }
}