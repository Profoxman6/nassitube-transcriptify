export const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const parseTranscriptXML = (xmlText: string): string => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const textElements = xmlDoc.getElementsByTagName("text");
  
  return Array.from(textElements)
    .map(element => element.textContent)
    .filter(text => text !== null)
    .join('\n');
};