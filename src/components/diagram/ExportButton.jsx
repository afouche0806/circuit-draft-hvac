import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, FileImage, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { NODE_W, NODE_H } from '@/components/diagram/componentLibrary';

const PAD = 60;

export default function ExportButton({ canvasRef, nodes, lines, title }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(null);

  const buildCanvas = async () => {
    const source = canvasRef.current;
    if (!source || nodes.length === 0) return null;

    const clone = document.createElement('div');
    clone.style.position = 'relative';
    clone.style.left = '-99999px';
    clone.style.top = '0';
    clone.style.width = source.style.width || '3000px';
    clone.style.height = source.style.height || '2000px';
    clone.innerHTML = source.innerHTML;
    document.body.appendChild(clone);

    try {
      const full = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const n of nodes) {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + NODE_W);
        maxY = Math.max(maxY, n.y + NODE_H);
      }
      for (const l of lines || []) {
        minX = Math.min(minX, l.x1, l.x2);
        minY = Math.min(minY, l.y1, l.y2);
        maxX = Math.max(maxX, l.x1, l.x2);
        maxY = Math.max(maxY, l.y1, l.y2);
      }
      minX -= PAD; minY -= PAD; maxX += PAD; maxY += PAD;
      const bw = maxX - minX;
      const bh = maxY - minY;

      const crop = document.createElement('canvas');
      crop.width = bw * 2;
      crop.height = bh * 2;
      const ctx = crop.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, crop.width, crop.height);
      ctx.drawImage(full, minX * 2, minY * 2, bw * 2, bh * 2, 0, 0, bw * 2, bh * 2);
      return crop;
    } finally {
      document.body.removeChild(clone);
    }
  };

  const safeName = (title.trim() || 'diagram').replace(/[^\w\- ]+/g, '').trim() || 'diagram';

  const exportPng = async () => {
    setBusy('png');
    try {
      const canvas = await buildCanvas();
      if (!canvas) {
        toast({ title: 'Nothing to export', description: 'Add some components first.', variant: 'destructive' });
        return;
      }
      const link = document.createElement('a');
      link.download = `${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'PNG exported' });
    } catch (err) {
      toast({ title: 'Export failed', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const exportPdf = async () => {
    setBusy('pdf');
    try {
      const canvas = await buildCanvas();
      if (!canvas) {
        toast({ title: 'Nothing to export', description: 'Add some components first.', variant: 'destructive' });
        return;
      }
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const headerH = 30;
      pdf.setFontSize(15);
      pdf.setTextColor(30, 41, 59);
      pdf.text(safeName, margin, margin + 12);
      pdf.setFontSize(9);
      pdf.setTextColor(120, 130, 145);
      pdf.text(new Date().toLocaleDateString(), pageW - margin, margin + 12, { align: 'right' });
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2 - headerH;
      const ratio = canvas.width / canvas.height;
      let w = availW;
      let h = w / ratio;
      if (h > availH) { h = availH; w = h * ratio; }
      const x = (pageW - w) / 2;
      const y = margin + headerH + (availH - h) / 2;
      pdf.addImage(imgData, 'PNG', x, y, w, h);
      pdf.save(`${safeName}.pdf`);
      toast({ title: 'PDF exported' });
    } catch (err) {
      toast({ title: 'Export failed', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!!busy} className="gap-1.5">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportPng} className="gap-2">
          <FileImage className="h-4 w-4" /> Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportPdf} className="gap-2">
          <FileText className="h-4 w-4" /> Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}