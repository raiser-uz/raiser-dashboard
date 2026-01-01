import { isBrowser } from "shared/lib"
import { browserConfig, serverConfig } from "../config"
import { Configuration, ConfigurationParameters } from "./_generated"

const browser: ConfigurationParameters = {
  ...browserConfig,
  basePath: "/api/warehouse-api",
}

const server: ConfigurationParameters = {
  ...serverConfig,
  basePath: process.env.WAREHOUSE_BACK_API_URL,
}

export class WarehouseApiConfig extends Configuration {
  constructor() {
    super(isBrowser() ? browser : server)
  }
}
