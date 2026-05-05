import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

export interface StudentCardData {
    id: number;
    name: string;
    nis: string | null;
    nisn: string | null;
    birthPlace: string | null;
    birthDate: string | null;
    address: string | null;
    religion: string | null;
    validUntil: string | null;
    photoDataUrl: string | null;
}

const CARD_WIDTH_PX = 856;
const CARD_HEIGHT_PX = 539.8;
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MARGIN_MM = 10;
const GAP_MM = 8;
const ROW_GAP_MM = 6;
const TOP_MARGIN_MM = 15;
const STUDENTS_PER_PAGE = 4;

function buildFrontCardHTML(data: StudentCardData): string {
    const photoHtml = data.photoDataUrl
        ? `<img src="${data.photoDataUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;" />`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e7eb;">
             <span style="font-size:48px;color:#9ca3af;">👤</span>
           </div>`;

    return `
    <div style="width:${CARD_WIDTH_PX}px;height:${CARD_HEIGHT_PX}px;position:relative;background-color:white;font-family:Arial,sans-serif;overflow:hidden;">
        <img src="/assets/student-id-cards/kartu-bg.png" alt="Background" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;z-index:0;" />
        <div style="position:absolute;inset:0;z-index:10;">
            <div style="position:absolute;top:185px;left:30px;width:180px;height:250px;background-color:#f0f0f0;overflow:hidden;">
                ${photoHtml}
            </div>
            <div style="position:absolute;top:185px;left:275px;right:20px;color:#000;font-weight:normal;font-size:20px;line-height:1.5;">
                <table style="width:100%;border-collapse:collapse;">
                    <tbody>
                        <tr><td style="width:110px;padding-bottom:4px;">No Induk</td><td style="width:20px;padding-bottom:4px;">:</td><td style="padding-bottom:4px;">${data.nis ?? '-'}</td></tr>
                        <tr><td style="width:110px;padding-bottom:4px;">NISN</td><td style="width:20px;padding-bottom:4px;">:</td><td style="padding-bottom:4px;">${data.nisn ?? '-'}</td></tr>
                        <tr><td style="width:110px;padding-bottom:4px;">Nama</td><td style="width:20px;padding-bottom:4px;">:</td><td style="padding-bottom:4px;">${data.name}</td></tr>
                        <tr><td style="width:110px;padding-bottom:4px;">TTL</td><td style="width:20px;padding-bottom:4px;">:</td><td style="padding-bottom:4px;">${data.birthPlace ?? '-'}, ${data.birthDate ?? '-'}</td></tr>
                        <tr><td style="width:110px;padding-bottom:4px;">Agama</td><td style="width:20px;padding-bottom:4px;">:</td><td style="padding-bottom:4px;">${data.religion ?? '-'}</td></tr>
                        <tr><td style="vertical-align:top;">Alamat</td><td style="vertical-align:top;">:</td><td style="vertical-align:top;line-height:1.2;">${data.address ?? '-'}</td></tr>
                    </tbody>
                </table>
            </div>
            <div id="barcode-container" style="position:absolute;top:445px;left:30px;width:180px;height:45px;display:flex;align-items:flex-end;justify-content:flex-start;">
                <canvas id="barcode"></canvas>
            </div>
            <div style="position:absolute;bottom:65px;left:275px;font-size:20px;font-weight:normal;color:#000;display:flex;align-items:center;">
                <span style="width:110px;">Berlaku</span><span style="width:20px;">:</span><span>${data.validUntil ?? '-'}</span>
            </div>
        </div>
    </div>`;
}

function buildBackCardHTML(): string {
    return `
    <div style="width:${CARD_WIDTH_PX}px;height:${CARD_HEIGHT_PX}px;position:relative;background-color:white;font-family:Arial,sans-serif;overflow:hidden;">
        <img src="/assets/student-id-cards/student-card.jpg" alt="Back Card" style="width:100%;height:100%;object-fit:fill;" />
    </div>`;
}

async function captureCardFromHTML(html: string, barcodeValue?: string): Promise<HTMLCanvasElement> {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.style.overflow = 'hidden';
    document.body.appendChild(wrapper);

    wrapper.innerHTML = html;
    const clone = wrapper.firstElementChild as HTMLElement;
    clone.style.transform = 'none';
    clone.style.transformOrigin = 'top left';

    if (barcodeValue) {
        const canvas = clone.querySelector('canvas#barcode') as HTMLCanvasElement;
        if (canvas) {
            JsBarcode(canvas, barcodeValue, {
                format: 'CODE128',
                displayValue: false,
                background: '#ffffff',
                lineColor: '#000000',
                margin: 0,
                height: 40,
                width: 2,
            });
            const barcodeDataUrl = canvas.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = barcodeDataUrl;
            img.style.cssText = canvas.style.cssText;
            img.style.width = canvas.style.width || '180px';
            img.style.height = canvas.style.height || '45px';
            canvas.parentNode?.replaceChild(img, canvas);
        }
    }

    const imgs = Array.from(clone.querySelectorAll('img'));
    await Promise.all(
        imgs.map((img) => new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
        }))
    );

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

export async function generateBatchIdCardsPDF(
    students: StudentCardData[],
    fileName: string = 'kartu-pelajar-batch.pdf',
    onProgress?: (current: number, total: number) => void,
    abortSignal?: AbortSignal,
): Promise<void> {
    if (students.length === 0) return;

    const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const contentWidth = PAGE_WIDTH_MM - MARGIN_MM * 2;
    const cardWidthMm = (contentWidth - GAP_MM) / 2;
    const cardHeightMm = (PAGE_HEIGHT_MM - TOP_MARGIN_MM * 2 - (STUDENTS_PER_PAGE - 1) * ROW_GAP_MM) / STUDENTS_PER_PAGE;

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        if (abortSignal?.aborted) throw new DOMException('Aborted', 'AbortError');

        if (pageIdx > 0) pdf.addPage();

        const pageStudents = students.slice(pageIdx * STUDENTS_PER_PAGE, (pageIdx + 1) * STUDENTS_PER_PAGE);

        for (let i = 0; i < pageStudents.length; i++) {
            if (abortSignal?.aborted) throw new DOMException('Aborted', 'AbortError');

            const student = pageStudents[i];
            const studentIdx = pageIdx * STUDENTS_PER_PAGE + i;
            onProgress?.(studentIdx + 1, students.length);

            const [frontCanvas, backCanvas] = await Promise.all([
                captureCardFromHTML(buildFrontCardHTML(student), student.nis ?? undefined),
                captureCardFromHTML(buildBackCardHTML()),
            ]);

            const x = MARGIN_MM;
            const y = TOP_MARGIN_MM + i * (cardHeightMm + ROW_GAP_MM);

            const frontData = frontCanvas.toDataURL('image/png');
            pdf.addImage(frontData, 'PNG', x, y, cardWidthMm, cardHeightMm);

            const backData = backCanvas.toDataURL('image/png');
            pdf.addImage(backData, 'PNG', x + cardWidthMm + GAP_MM, y, cardWidthMm, cardHeightMm);
        }
    }

    pdf.save(fileName);
}