<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Rekomendasi Paspor - {{ $recommendation->nama_paspor }}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 14px;
            line-height: 1.5;
            color: #000;
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
            box-sizing: border-box;
            position: relative;
            background-color: #fff;
        }
        
        /* Kop Surat */
        .header-kop {
            width: 100%;
            height: auto;
            display: block;
        }

        /* Watermark Background */
        .watermark {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px;
            height: auto;
            opacity: 0.08;
            z-index: 1;
            pointer-events: none;
        }

        /* Footer */
        .footer-img {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            z-index: 2;
        }

        /* Content Area */
        .content {
            position: relative;
            z-index: 5;
            padding-left: 28mm;
            padding-right: 20mm;
            padding-top: 10mm;
            padding-bottom: 30mm;
        }

        /* Meta Table (Nomor, Perihal) */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .meta-table td {
            padding: 2px 0;
            vertical-align: top;
        }
        .meta-label {
            width: 80px;
        }
        .meta-colon {
            width: 15px;
            text-align: center;
        }

        .salutation {
            margin-bottom: 25px;
        }
        .salutation p {
            margin: 0;
        }
        .salutation .destination {
            font-weight: bold;
        }

        .opening {
            margin-bottom: 20px;
            text-align: justify;
        }

        /* List Items */
        .list-container {
            margin-bottom: 20px;
            padding-left: 5px;
        }
        .list-item {
            margin-bottom: 15px;
            text-align: justify;
        }
        .sub-list {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-left: 20px;
        }
        .sub-list td {
            padding: 3px 0;
            vertical-align: top;
        }
        .sub-label {
            width: 180px;
        }
        .sub-colon {
            width: 15px;
            text-align: center;
        }

        .closing {
            margin-bottom: 25px;
            text-align: justify;
        }

        /* Signatures */
        .signature-section {
            width: 100%;
            margin-top: 30px;
            position: relative;
        }
        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }
        .signature-space {
            height: 85px;
        }
        .signature-title {
            text-align: right;
            padding-right: 40px;
        }
        .signature-name {
            text-align: right;
            font-weight: bold;
            text-decoration: underline;
            padding-right: 40px;
            margin-bottom: 2px;
        }
        .signature-role {
            text-align: right;
            padding-right: 40px;
            font-weight: bold;
        }

        /* Stempel/TTE Stamp Overlay */
        .stempel-overlay {
            position: absolute;
            right: 40px;
            bottom: -5px;
            width: 200px;
            height: auto;
            z-index: 10;
            pointer-events: none;
        }

        /* Controls for printing */
        .print-toolbar {
            background-color: #1e293b;
            color: #fff;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: sans-serif;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .print-btn {
            background-color: #059669;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        .print-btn:hover {
            background-color: #047857;
        }
        .back-btn {
            background-color: transparent;
            color: #cbd5e1;
            border: 1px solid #475569;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .back-btn:hover {
            background-color: #334155;
            color: #fff;
        }

        @media print {
            .print-toolbar {
                display: none !important;
            }
            body {
                background-color: #fff;
            }
        }
    </style>
</head>
<body>

    <!-- Print Toolbar (Only visible on screen) -->
    <div class="print-toolbar">
        <div>
            <span style="font-weight: bold;">Dokumen Cetak Surat Rekomendasi</span>
            <span style="font-size: 11px; color: #94a3b8; margin-left: 8px;">
                Status: {{ $signed ? 'Tertanda Tangan' : 'Kosongan' }}
            </span>
        </div>
        <div style="display: flex; gap: 8px;">
            <button onclick="window.history.back()" class="back-btn">Kembali</button>
            <button onclick="window.print()" class="print-btn">Cetak / Simpan PDF</button>
        </div>
    </div>

    <!-- Kop Surat -->
    <img src="/images/logo_surat/KOP SURAT CABANG.png" alt="Kop Surat" class="header-kop">

    <!-- Watermark Background -->
    <img src="/images/logo_surat/WATER MARK CABANG.png" alt="Watermark" class="watermark">

    <!-- Content -->
    <div class="content">
        <table class="meta-table">
            <tr>
                <td class="meta-label">Nomor</td>
                <td class="meta-colon">:</td>
                <td>{{ $nomorSurat }}</td>
            </tr>
            <tr>
                <td class="meta-label">Perihal</td>
                <td class="meta-colon">:</td>
                <td><strong>Rekomendasi Pembuatan Paspor</strong></td>
            </tr>
        </table>

        <div class="salutation">
            <p>Kepada Yth</p>
            <p class="destination">Kepala Kantor Imigrasi Kelas I TPI {{ $recommendation->jamaahMember->paspor_office ?: 'Pasuruan' }}</p>
            <p>Di tempat</p>
        </div>

        <div class="opening">
            <p>Yang bertanda tangan di bawah ini:</p>
            <table style="width: 100%; margin-left: 0px; margin-bottom: 15px;">
                <tr>
                    <td style="width: 100px;">Nama</td>
                    <td style="width: 15px; text-align: center;">:</td>
                    <td style="font-weight: bold;">MUHAMMAD MAHSUN</td>
                </tr>
                <tr>
                    <td>Jabatan</td>
                    <td>:</td>
                    <td style="font-weight: bold;">DIREKTUR UTAMA PT AN NAMIROH TRAVELINDO PASURUAN</td>
                </tr>
            </table>
            <p>Bertindak untuk dan atas nama <strong>PT. An Namiroh Travelindo Pasuruan</strong>, berdasarkan SK Umroh PPIU Kemenag RI No. 11/Tahun 2020, dengan ini memberikan rekomendasi dan menyatakan bahwa:</p>
        </div>

        <div class="list-container">
            <div class="list-item">
                1. Memberikan rekomendasi membuat paspor untuk keberangkatan umroh melalui <strong>PT. An Namiroh Travelindo Pasuruan</strong>, kepada:
                <table class="sub-list">
                    <tr>
                        <td class="sub-label">Nama</td>
                        <td class="sub-colon">:</td>
                        <td style="font-weight: bold;">{{ $recommendation->nama_paspor }}</td>
                    </tr>
                    <tr>
                        <td class="sub-label">Tempat, Tanggal Lahir</td>
                        <td class="sub-colon">:</td>
                        <td>{{ $recommendation->jamaahMember->tempat_lahir ?: '-' }}, {{ $dob }}</td>
                    </tr>
                    <tr>
                        <td class="sub-label">Alamat</td>
                        <td class="sub-colon">:</td>
                        <td>{{ $recommendation->jamaahMember->user->profile->alamat ?? '-' }}</td>
                    </tr>
                </table>
            </div>

            <div class="list-item">
                2. Kami menjamin bahwa calon jama'ah umroh yang kami urus tidak akan melanggar peraturan keimigrasian berupa penyalahgunaan izin tinggal, tinggal melebihi izin tinggalnya, memalsukan atau membuat paspor palsu yang telah diberikan kepadanya maupun bekerja sebagai ilegal.
            </div>

            <div class="list-item">
                3. Kami menjamin dan bertanggung jawab terhadap keberangkatan dan kembalinya jama'ah umroh ke Indonesia.
            </div>
        </div>

        <div class="closing">
            Demikian surat pernyataan dan jaminan ini dibuat agar digunakan sebagaimana mestinya, atas perhatian dan kerjasamanya kami sampaikan terima kasih.
        </div>

        <!-- Signature Area -->
        <div class="signature-section">
            <div class="signature-title">
                Pasuruan, {{ $recommendation->created_at->format('d/m/Y') }}
            </div>
            <div class="signature-title" style="margin-bottom: 10px;">
                PT ANNAMIROH TRAVELINDO PASURUAN
            </div>
            
            <div class="signature-space"></div>
            
            <div class="signature-name">
                MUHAMMAD MAHSUN
            </div>
            <div class="signature-role">
                DIREKTUR UTAMA
            </div>

            <!-- Stempel & Signature Overlay if Signed -->
            @if($signed)
                <img src="/images/logo_surat/STEMPEL CABANG.png" alt="Stempel Cabang" class="stempel-overlay">
            @endif
        </div>
    </div>

    <!-- Footer -->
    <img src="/images/logo_surat/FOOTER CABANG.png" alt="Footer" class="footer-img">

</body>
</html>
