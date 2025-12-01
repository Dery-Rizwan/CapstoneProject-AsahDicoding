const { BAPB, BAPP, BAPBItem, BAPPWorkItem, User, BAPBAttachment, BAPPAttachment } = require('../models');
const fs = require('fs').promises;
const path = require('path');

// Helper function to format date
const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Generate HTML template for BAPB
const generateBAPBHTML = (bapb, items, vendor, picGudang, signatures) => {
  const itemRows = items.map((item, index) => `
    <tr>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #000; padding: 8px;">${item.itemName}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantityOrdered}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantityReceived}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.unit}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.condition === 'baik' ? 'Baik' : item.condition === 'rusak' ? 'Rusak' : 'Kurang'}</td>
      <td style="border: 1px solid #000; padding: 8px;">${item.notes || '-'}</td>
    </tr>
  `).join('');

  const vendorSignature = signatures.find(s => s.uploadedBy === vendor.id);
  const picSignature = signatures.find(s => s.uploadedBy === (picGudang?.id || null));

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BAPB - ${bapb.bapbNumber}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 40px;
      color: #000;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      text-decoration: underline;
    }
    .header p {
      margin: 5px 0;
      font-size: 14px;
    }
    .info-section {
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      width: 200px;
      font-weight: bold;
    }
    .info-value {
      flex: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background-color: #f0f0f0;
      border: 1px solid #000;
      padding: 10px;
      text-align: center;
      font-weight: bold;
    }
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 45%;
      text-align: center;
    }
    .signature-box p {
      margin: 5px 0;
    }
    .signature-image {
      margin: 20px 0;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .signature-image img {
      max-height: 80px;
      max-width: 200px;
    }
    .notes-section {
      margin-top: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>BERITA ACARA PEMERIKSAAN BARANG</h1>
    <p>(BAPB)</p>
    <p>Nomor: ${bapb.bapbNumber}</p>
  </div>

  <div class="info-section">
    <div class="info-row">
      <div class="info-label">Nomor Pesanan:</div>
      <div class="info-value">${bapb.orderNumber}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Tanggal Pengiriman:</div>
      <div class="info-value">${formatDate(bapb.deliveryDate)}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Vendor:</div>
      <div class="info-value">${vendor.name} - ${vendor.company || '-'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">PIC Gudang:</div>
      <div class="info-value">${picGudang ? `${picGudang.name}` : '-'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Status:</div>
      <div class="info-value">${bapb.status.toUpperCase()}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 25%;">Nama Barang</th>
        <th style="width: 10%;">Qty Pesan</th>
        <th style="width: 10%;">Qty Terima</th>
        <th style="width: 10%;">Satuan</th>
        <th style="width: 15%;">Kondisi</th>
        <th style="width: 25%;">Keterangan</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  ${bapb.notes ? `
  <div class="notes-section">
    <strong>Catatan:</strong>
    <p>${bapb.notes}</p>
  </div>
  ` : ''}

  <div class="signature-section">
    <div class="signature-box">
      <p><strong>Vendor</strong></p>
      <p>${vendor.name}</p>
      <div class="signature-image">
        ${vendorSignature ? `<img src="${vendorSignature.filePath}" alt="Signature">` : '<p style="color: #999;">Belum ditandatangani</p>'}
      </div>
      <p>_____________________</p>
      <p>${formatDate(vendorSignature?.createdAt || null)}</p>
    </div>

    <div class="signature-box">
      <p><strong>PIC Gudang</strong></p>
      <p>${picGudang?.name || '-'}</p>
      <div class="signature-image">
        ${picSignature ? `<img src="${picSignature.filePath}" alt="Signature">` : '<p style="color: #999;">Belum ditandatangani</p>'}
      </div>
      <p>_____________________</p>
      <p>${formatDate(picSignature?.createdAt || null)}</p>
    </div>
  </div>

  <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
    <p>Dokumen ini dibuat secara digital melalui BA Digital System</p>
    <p>Dicetak pada: ${formatDate(new Date())}</p>
  </div>
</body>
</html>
  `;
};

// Generate HTML template for BAPP
const generateBAPPHTML = (bapp, workItems, vendor, direksi, signatures) => {
  const workItemRows = workItems.map((item, index) => `
    <tr>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #000; padding: 8px;">${item.workItemName}</td>
      <td style="border: 1px solid #000; padding: 8px;">${item.description || '-'}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.plannedProgress}%</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.actualProgress}%</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.unit}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quality}</td>
    </tr>
  `).join('');

  const vendorSignature = signatures.find(s => s.uploadedBy === vendor.id);
  const direksiSignature = signatures.find(s => s.uploadedBy === (direksi?.id || null));

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BAPP - ${bapp.bappNumber}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 40px;
      color: #000;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      text-decoration: underline;
    }
    .header p {
      margin: 5px 0;
      font-size: 14px;
    }
    .info-section {
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      width: 200px;
      font-weight: bold;
    }
    .info-value {
      flex: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background-color: #f0f0f0;
      border: 1px solid #000;
      padding: 10px;
      text-align: center;
      font-weight: bold;
    }
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 45%;
      text-align: center;
    }
    .signature-box p {
      margin: 5px 0;
    }
    .signature-image {
      margin: 20px 0;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .signature-image img {
      max-height: 80px;
      max-width: 200px;
    }
    .progress-summary {
      margin: 20px 0;
      padding: 15px;
      background-color: #e8f5e9;
      border: 2px solid #4caf50;
      border-radius: 4px;
      text-align: center;
    }
    .progress-summary h3 {
      margin: 0 0 10px 0;
      color: #2e7d32;
    }
    .notes-section {
      margin-top: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>BERITA ACARA PEMERIKSAAN PEKERJAAN</h1>
    <p>(BAPP)</p>
    <p>Nomor: ${bapp.bappNumber}</p>
  </div>

  <div class="info-section">
    <div class="info-row">
      <div class="info-label">Nomor Kontrak:</div>
      <div class="info-value">${bapp.contractNumber}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Nama Proyek:</div>
      <div class="info-value">${bapp.projectName}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Lokasi Proyek:</div>
      <div class="info-value">${bapp.projectLocation}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Tanggal Mulai:</div>
      <div class="info-value">${formatDate(bapp.startDate)}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Tanggal Selesai:</div>
      <div class="info-value">${formatDate(bapp.endDate)}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Tanggal Penyelesaian:</div>
      <div class="info-value">${formatDate(bapp.completionDate)}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Vendor:</div>
      <div class="info-value">${vendor.name} - ${vendor.company || '-'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Direksi Pekerjaan:</div>
      <div class="info-value">${direksi ? `${direksi.name}` : '-'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Status:</div>
      <div class="info-value">${bapp.status.toUpperCase()}</div>
    </div>
  </div>

  <div class="progress-summary">
    <h3>Total Progress Pekerjaan</h3>
    <h2 style="margin: 0; color: #1b5e20; font-size: 36px;">${bapp.totalProgress}%</h2>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 20%;">Item Pekerjaan</th>
        <th style="width: 20%;">Deskripsi</th>
        <th style="width: 10%;">Rencana</th>
        <th style="width: 10%;">Aktual</th>
        <th style="width: 10%;">Satuan</th>
        <th style="width: 15%;">Kualitas</th>
      </tr>
    </thead>
    <tbody>
      ${workItemRows}
    </tbody>
  </table>

  ${bapp.notes ? `
  <div class="notes-section">
    <strong>Catatan:</strong>
    <p>${bapp.notes}</p>
  </div>
  ` : ''}

  <div class="signature-section">
    <div class="signature-box">
      <p><strong>Vendor</strong></p>
      <p>${vendor.name}</p>
      <div class="signature-image">
        ${vendorSignature ? `<img src="${vendorSignature.filePath}" alt="Signature">` : '<p style="color: #999;">Belum ditandatangani</p>'}
      </div>
      <p>_____________________</p>
      <p>${formatDate(vendorSignature?.createdAt || null)}</p>
    </div>

    <div class="signature-box">
      <p><strong>Direksi Pekerjaan</strong></p>
      <p>${direksi?.name || '-'}</p>
      <div class="signature-image">
        ${direksiSignature ? `<img src="${direksiSignature.filePath}" alt="Signature">` : '<p style="color: #999;">Belum ditandatangani</p>'}
      </div>
      <p>_____________________</p>
      <p>${formatDate(direksiSignature?.createdAt || null)}</p>
    </div>
  </div>

  <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
    <p>Dokumen ini dibuat secara digital melalui BA Digital System</p>
    <p>Dicetak pada: ${formatDate(new Date())}</p>
  </div>
</body>
</html>
  `;
};

// Generate BAPB Document
exports.generateBAPBDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'html' } = req.query; // html or pdf

    const bapb = await BAPB.findByPk(id, {
      include: [
        { model: User, as: 'vendor', attributes: ['id', 'name', 'email', 'company'] },
        { model: User, as: 'picGudang', attributes: ['id', 'name', 'email'] },
        { model: BAPBItem, as: 'items' }
      ]
    });

    if (!bapb) {
      return res.status(404).json({
        success: false,
        message: 'BAPB not found'
      });
    }

    // Check authorization
    if (req.user.role === 'vendor' && bapb.vendorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate document for this BAPB'
      });
    }

    // Get signatures
    const signatures = await BAPBAttachment.findAll({
      where: {
        bapbId: id,
        fileType: 'signature'
      }
    });

    // Generate HTML
    const html = generateBAPBHTML(
      bapb,
      bapb.items,
      bapb.vendor,
      bapb.picGudang,
      signatures
    );

    if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      // For PDF, return HTML with print instructions
      // In production, you would use a library like puppeteer or html-pdf
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        ${html}
        <script>
          // Auto print for PDF generation
          window.onload = function() {
            // window.print();
          };
        </script>
      `);
    }
  } catch (error) {
    console.error('Generate BAPB document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating document',
      error: error.message
    });
  }
};

// Generate BAPP Document
exports.generateBAPPDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'html' } = req.query;

    const bapp = await BAPP.findByPk(id, {
      include: [
        { model: User, as: 'vendor', attributes: ['id', 'name', 'email', 'company'] },
        { model: User, as: 'direksiPekerjaan', attributes: ['id', 'name', 'email'] },
        { model: BAPPWorkItem, as: 'workItems' }
      ]
    });

    if (!bapp) {
      return res.status(404).json({
        success: false,
        message: 'BAPP not found'
      });
    }

    // Check authorization
    if (req.user.role === 'vendor' && bapp.vendorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate document for this BAPP'
      });
    }

    // Get signatures
    const signatures = await BAPPAttachment.findAll({
      where: {
        bappId: id,
        fileType: 'signature'
      }
    });

    // Generate HTML
    const html = generateBAPPHTML(
      bapp,
      bapp.workItems,
      bapp.vendor,
      bapp.direksiPekerjaan,
      signatures
    );

    if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        ${html}
        <script>
          window.onload = function() {
            // window.print();
          };
        </script>
      `);
    }
  } catch (error) {
    console.error('Generate BAPP document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating document',
      error: error.message
    });
  }
};

// Preview BAPB Document
exports.previewBAPBDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const bapb = await BAPB.findByPk(id, {
      include: [
        { model: User, as: 'vendor' },
        { model: User, as: 'picGudang' },
        { model: BAPBItem, as: 'items' }
      ]
    });

    if (!bapb) {
      return res.status(404).json({
        success: false,
        message: 'BAPB not found'
      });
    }

    const signatures = await BAPBAttachment.findAll({
      where: { bapbId: id, fileType: 'signature' }
    });

    const html = generateBAPBHTML(bapb, bapb.items, bapb.vendor, bapb.picGudang, signatures);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Preview BAPB document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating preview',
      error: error.message
    });
  }
};

// Preview BAPP Document
exports.previewBAPPDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const bapp = await BAPP.findByPk(id, {
      include: [
        { model: User, as: 'vendor' },
        { model: User, as: 'direksiPekerjaan' },
        { model: BAPPWorkItem, as: 'workItems' }
      ]
    });

    if (!bapp) {
      return res.status(404).json({
        success: false,
        message: 'BAPP not found'
      });
    }

    const signatures = await BAPPAttachment.findAll({
      where: { bappId: id, fileType: 'signature' }
    });

    const html = generateBAPPHTML(bapp, bapp.workItems, bapp.vendor, bapp.direksiPekerjaan, signatures);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Preview BAPP document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating preview',
      error: error.message
    });
  }
};