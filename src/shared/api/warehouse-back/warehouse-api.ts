import { AccountApi, AdminApi, AuthenticationApi, Configuration } from "./_generated"
import { WarehouseApiConfig } from "./config"

export class WarehouseBackApi {
  constructor(private config: Configuration = new WarehouseApiConfig()) {}

  readonly authentication = new AuthenticationApi(this.config)
  readonly account = new AccountApi(this.config)
  readonly admin = new AdminApi(this.config)
}
