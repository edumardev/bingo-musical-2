import Papa from 'papaparse';

const read = async (songs) => {
    const response = await fetch(songs); // Ruta desde la carpeta public
    const reader = response.body.getReader();
    const result = await reader.read(); // Leer el archivo
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);

    return new Promise(resolve => {
        Papa.parse(csv, {
            complete: function (data) {
              resolve(data.data.filter(item => item[0]))
            },
          });
    })
}

export default read