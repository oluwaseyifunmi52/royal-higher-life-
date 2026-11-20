export const webpMap = {
  "Instagram.png": "Instagram.webp",
  "school 4.jpeg": "school 4.webp",
  "school 5.jpeg": "school 5.webp",
  "royal logo.jpeg": "royal logo.webp",
  "welcome pics.jpeg": "welcome pics.webp",
  "royal1.jpeg": "royal1.webp",
  "royal7.jpeg": "royal7.webp",
  "royal8.jpeg": "royal8.webp",
  "royal10.jpeg": "royal10.webp",
  "royal11.jpeg": "royal11.webp",
  "royal12.jpeg": "royal12.webp",
  "new4.jpeg": "new4.webp",
  "new5.jpeg": "new5.webp",
  "oba.jpeg": "oba.webp",
  "RoyalLove.jpeg": "RoyalLove.webp",
  "Faith.jpg": "Faith.webp",
  "prayer.jpg": "prayer.webp",
  "whatapp.jpg": "whatapp.webp",
};

export const galleryThumbMap = {
  royal12: "thumb-royal12.webp",
  royal11: "thumb-royal11.webp",
  royal10: "thumb-royal10.webp",
  royal8: "thumb-royal8.webp",
  royal7: "thumb-royal7.webp",
  royal5: "thumb-royal5.webp",
  royal4: "thumb-royal4.webp",
  royal3: "thumb-royal3.webp",
  royal2: "thumb-royal2.webp",
  rolay1: "thumb-rolay1.webp",
  oba: "thumb-oba.webp",
  new1: "thumb-new1.webp",
  new2: "thumb-new2.webp",
  new3: "thumb-new3.webp",
  new4: "thumb-new4.webp",
  new5: "thumb-new5.webp",
  new6: "thumb-new6.webp",
  "school 4": "thumb-school 4.webp",
  "school 5": "thumb-school 5.webp",
  royal1: "thumb-royal1.webp",
  "royal3 (1)": "thumb-royal3 (1).webp",
  RoyalLove: "thumb-RoyalLove.webp",
};

export const asset = (path) => new URL(`../assets/${path}`, import.meta.url).href;

export function webpFor(src) {
  if (!src) return src;
  const file = src.split(/[/\\]+/).pop();
  return webpMap[file] ? asset(webpMap[file]) : src;
}

export function galleryThumbFor(src) {
  if (!src) return src;
  const name = pathName(src);
  return galleryThumbMap[name] ? asset(galleryThumbMap[name]) : src;
}

function pathName(src) {
  const file = src.split(/[/\\]+/).pop();
  return file.replace(/\.[^/.]+$/, "");
}
