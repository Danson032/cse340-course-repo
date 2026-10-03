const FLASH_COOKIE = "cse340_flash";

const parseCookies = (header = "") => Object.fromEntries(
  header.split(";").filter(Boolean).map((part) => {
    const index = part.indexOf("=");
    if (index === -1) return [part.trim(), ""];
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }),
);

export const flashMiddleware = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  res.locals.flash = cookies[FLASH_COOKIE] || null;

  if (cookies[FLASH_COOKIE]) {
    res.setHeader("Set-Cookie", `${FLASH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  }

  res.flash = (message) => {
    res.setHeader(
      "Set-Cookie",
      `${FLASH_COOKIE}=${encodeURIComponent(message)}; Path=/; Max-Age=10; HttpOnly; SameSite=Lax`,
    );
  };

  next();
};
