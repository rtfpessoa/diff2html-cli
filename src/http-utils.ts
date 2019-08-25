import * as request from "request";

export function put<T extends object>(url: string, payload: object): Promise<T> {
  return new Promise<T>((resolve, reject): void => {
    request({
      url: url,
      method: "PUT",
      headers: {},
      body: payload,
      json: true
    })
      .on("response", (response) => {
        response.on("data", (body) => {
          try {
            const jsonObj = JSON.parse(body.toString("utf8"));
            if (jsonObj as T) {
              return resolve(jsonObj);
            } else if (jsonObj.error !== undefined && typeof jsonObj.error === "string") {
              return reject(new Error(jsonObj.error));
            } else {
              return reject(
                new Error(
                  `Failed to read response.
                Body:
                ${body.toString("utf8")}`
                )
              );
            }
          } catch (err) {
            return reject(err);
          }
        });
      })
      .on("error", (err) => reject(err));
  });
}
