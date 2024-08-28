import { Buffer } from "buffer";

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        Buffer.from(base64, "base64")
            .toString("ascii")
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

const isTokenExpired = (token) => {
    const payload = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log(new Date(payload.exp), payload.exp < currentTime)
    return payload.exp < currentTime;
};

export { isTokenExpired };
