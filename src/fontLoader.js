const fontStylesheet = document.getElementById("brand-fonts");

if (fontStylesheet) {
  const applyBrandFonts = () => {
    fontStylesheet.media = "all";
  };

  if (fontStylesheet.sheet) {
    applyBrandFonts();
  } else {
    fontStylesheet.addEventListener("load", applyBrandFonts, { once: true });
  }
}
