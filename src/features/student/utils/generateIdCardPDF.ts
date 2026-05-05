import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Clone elemen ke hidden container tanpa transform scale, lalu capture.
 * Gambar foto siswa sudah berupa data URL di DOM (di-handle di Profile.tsx),
 * sehingga html2canvas tidak perlu load gambar eksternal.
 */
async function captureElement(
    el: HTMLElement,
    barcodeDataUrl?: string,
): Promise<HTMLCanvasElement> {
    const originalWidth = el.style.width;
    const originalHeight = el.style.height;

    // 1. Buat container hidden
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.style.width = originalWidth;
    wrapper.style.height = originalHeight;
    wrapper.style.overflow = 'hidden';
    document.body.appendChild(wrapper);

    // 2. Clone & hapus transform scale
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.transformOrigin = 'top left';
    wrapper.appendChild(clone);

    // 3. Ganti <canvas> (barcode) dengan <img> berisi data URL
    //    cloneNode tidak menyalin pixel canvas, jadi harus diganti manual
    if (barcodeDataUrl) {
        const canvasEls = Array.from(clone.querySelectorAll('canvas'));
        canvasEls.forEach((c) => {
            const img = document.createElement('img');
            img.src = barcodeDataUrl;
            img.style.cssText = c.style.cssText;
            img.style.width = c.style.width || c.getAttribute('width') + 'px';
            img.style.height =
                c.style.height || c.getAttribute('height') + 'px';
            c.parentNode?.replaceChild(img, c);
        });
    }

    // 4. Pastikan semua <img> selesai load sebelum capture
    const imgs = Array.from(clone.querySelectorAll('img'));
    await Promise.all(
        imgs.map(
            (img) =>
                new Promise<void>((resolve) => {
                    if (img.complete) return resolve();
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                }),
        ),
    );

    // 5. Capture
    const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
    });

    document.body.removeChild(wrapper);
    return canvas;
}

/**
 * Generate PDF kartu pelajar dari dua elemen DOM (depan & belakang).
 * Hasil: satu lembar A4 portrait dengan kartu depan di kiri dan belakang di kanan.
 * @param barcodeCanvasDataUrl - data URL dari canvas barcode (karena cloneNode tidak menyalin pixel canvas)
 */
export async function generateIdCardPDF(
    frontEl: HTMLElement,
    backEl: HTMLElement,
    fileName: string = 'kartu-pelajar.pdf',
    barcodeCanvasDataUrl?: string,
): Promise<void> {
    // Capture kedua elemen secara paralel
    const [frontCanvas, backCanvas] = await Promise.all([
        captureElement(frontEl, barcodeCanvasDataUrl),
        captureElement(backEl),
    ]);

    // Ukuran kartu dalam mm (sesuai inner div 856 x 539.8 px,
    // kita anggap 1 px = 0.1 mm -> ~85.6 mm x ~54 mm)
    const cardWidthMm = 85.6;
    const cardHeightMm = 53.98;

    // Halaman A4 portrait
    const pageWidthMm = 210;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Posisi kartu: di atas halaman, di tengah horizontal
    const gapMm = 10; // jarak antar kartu
    const totalCardsWidth = cardWidthMm * 2 + gapMm;
    const startX = (pageWidthMm - totalCardsWidth) / 2;
    const startY = 15; // margin atas 15mm

    // Gambar depan (kiri)
    const frontData = frontCanvas.toDataURL('image/png');
    pdf.addImage(frontData, 'PNG', startX, startY, cardWidthMm, cardHeightMm);

    // Gambar belakang (kanan)
    const backData = backCanvas.toDataURL('image/png');
    pdf.addImage(
        backData,
        'PNG',
        startX + cardWidthMm + gapMm,
        startY,
        cardWidthMm,
        cardHeightMm,
    );

    pdf.save(fileName);
}
