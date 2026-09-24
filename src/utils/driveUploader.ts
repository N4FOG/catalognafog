/**
 * Utilitário para otimização e upload de imagens para o Google Drive
 * através do Google Apps Script configurado no projeto.
 */
import { CONFIG } from '../data/config';

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  fallbackUrl?: string;
  fileId?: string;
  error?: string;
}

/**
 * Comprime e redimensiona um arquivo de imagem diretamente no navegador
 * antes de enviar, economizando dados e garantindo carregamento rápido.
 */
export async function optimizeImageForWeb(
  file: File,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.85
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar imagem para compressão'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Mantém a proporção redimensionando se ultrapassar o limite
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context indisponível'));
          return;
        }

        // Fundo transparente ou branco suave se for JPEG
        ctx.drawImage(img, 0, 0, width, height);

        // Prefere WebP se o navegador suportar, senão JPEG
        const outputMime = 'image/webp';
        let dataUrl = canvas.toDataURL(outputMime, quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const mime = dataUrl.split(';')[0].replace('data:', '');
        resolve({
          base64: dataUrl,
          mimeType: mime
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Faz o upload da imagem otimizada para o Google Apps Script que salva no Google Drive
 */
export async function uploadImageToDrive(
  file: File,
  productName: string
): Promise<ImageUploadResult> {
  const webhookUrl = CONFIG.auditWebhookUrl;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return {
      success: false,
      error: 'URL do Google Apps Script não configurada em config.ts'
    };
  }

  try {
    // 1. Otimiza a imagem no cliente
    const { base64, mimeType } = await optimizeImageForWeb(file);

    const safeName = productName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 40);

    const ext = mimeType.includes('webp') ? 'webp' : 'jpg';
    const fileName = `${safeName}_${Date.now()}.${ext}`;

    // 2. Envia para o Google Apps Script
    const payload = {
      action: 'uploadImage',
      fileName: fileName,
      mimeType: mimeType,
      base64: base64
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Compatível com CORS do Apps Script
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Falha na requisição ao servidor (${response.status})`
      };
    }

    const data = await response.json();
    if (data && data.status === 'success' && (data.imageUrl || data.fallbackUrl)) {
      return {
        success: true,
        imageUrl: data.imageUrl || data.fallbackUrl,
        fallbackUrl: data.fallbackUrl,
        fileId: data.fileId
      };
    }

    return {
      success: false,
      error: data?.message || 'Servidor não retornou URL da imagem'
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Erro ao fazer upload da foto: ${errorMsg}`
    };
  }
}
