
import { supabase } from '../../client';


async function uploadFile(file: File) {
  // converte para Base64
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = reader.result as string;

      // chama a função edge
      const { data, error } = await supabase.functions.invoke("auto-upload-media", {
        body: {
          src: base64, 
          name: file.name
        }
      });

      if (error) return reject(error);

      // a função retorna o public_url
      resolve(data[0].public_url);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
