export function readFileContent(file) {
  if (file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (result) => {
        res(result);
      };
      reader.onerror = (err) => {
        rej(err);
      };
    });
  }
}
