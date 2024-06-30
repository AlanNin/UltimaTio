export function getTextTracks(base: any) {
  const baseUrl = base?.subtitleUrls;

  const textTracks = baseUrl.map((subtitle: any) => {
    const languageMap: {
      [key: string]: { label: string; language: string };
    } = {
      eng: { label: "English", language: "en-US" },
      spa: { label: "Spanish", language: "es-ES" },
      fre: { label: "French", language: "fr-FR" },
      ita: { label: "Italian", language: "it-IT" },
      swe: { label: "Swedish", language: "sv-SE" },
      ger: { label: "German", language: "de-DE" },
      por: { label: "Portuguese", language: "pt-PT" },
      fin: { label: "Finnish", language: "fi-FI" },
    };

    // Buscar el idioma en el mapa que coincida con el contenido del código de idioma
    const detectedLanguage =
      Object.keys(languageMap).find((lang) =>
        subtitle.language.includes(lang)
      ) || "unknown";
    const languageInfo = languageMap[detectedLanguage];

    return {
      src: subtitle.url,
      label: languageInfo.label,
      language: languageInfo.language,
      kind: "subtitles",
      default: languageInfo.language === "en-US",
    };
  });

  return textTracks;
}
