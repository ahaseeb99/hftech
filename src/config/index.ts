import packageJson from "../../package.json";

const isProduction: Boolean = process.env.NODE_ENV === "production";

export const BACKEND_BASE_URL: string = isProduction
? process.env.REACT_APP_BASE_URL_PROD || "https://hftechnode.dagnum.com"
: process.env.REACT_APP_BASE_URL_DEV || "http://localhost:4000"
// : process.env.REACT_APP_BASE_URL_DEV || "https://api-dev.hftechaz.com/"
// const BACKEND_BASE_URL: string =
//   process.env.REACT_APP_BASE_URL_PROD || "https://hftechnode.dagnum.com";

const BASE_API_VERSION: string = `v${
  packageJson.version ? packageJson.version : "1.0.0"
}`;


export const BACKEND_SERVER_URL: string = `${BACKEND_BASE_URL}/api/${BASE_API_VERSION}`;
// export const BACKEND_SERVER_URL: string = `http://localhost:9000/api/${BASE_API_VERSION}`;
