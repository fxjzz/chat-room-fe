export const httpHost =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000/"
    : "http://43.143.125.75:3000/";
export const wsHOST =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/"
    : "http://43.143.125.75:3001/";
