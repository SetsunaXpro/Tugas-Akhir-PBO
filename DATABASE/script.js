document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    const MOCK_DATA = {
       "patients": {
        "PSN001": { "name": "MOHAMAD ZULFIKLI", "age": 45, "gender": "Laki-laki" },
        "PSN002": { "name": "Natasya Dilah Sofiani", "age": 29, "gender": "Perempuan" },
        "PSN003": { "name": "Fahry", "age": 14, "gender": "Laki-laki" },
        "PSN004": { "name": "Ahmad Wijaya", "age": 62, "gender": "Laki-laki" },
        "PSN005": { "name": "Lionel Messi", "age": 37, "gender": "Laki-laki" },
        "PSN006": { "name": "Charles Leclerc", "age": 27, "gender": "Laki-laki" },
        "PSN007": { "name": "Murano Sayaka", "age": 17, "gender": "Perempuan" },
        "PSN008": { "name": "Kusunoki Tomori", "age": 25, "gender": "Perempuan" }
    },
        doctors: {
            "Umum": [
                { name: "Dr. Hartono", schedule: "Senin, 10:00 - 12:00" },
                { name: "Dr. Indah", schedule: "Selasa, 14:00 - 16:00" },
            ],
            "Gigi": [
                { name: "Drg. Anisa", schedule: "Rabu, 09:00 - 11:00" },
                { name: "Drg. Rian", schedule: "Jumat, 13:00 - 15:00" },
            ],
            "Syaraf": [
                { name: "Dr. Sp.S. Budiarto", schedule: "Kamis, 11:00 - 13:00" },
                { name: "Dr. Sp.S. Karina", schedule: "Sabtu, 10:00 - 12:00" },
            ]
        },
        prices: {
            rooms: {
                "Reguler": 500000,
                "Suite": 1000000,
                "VIP": 2000000
            },
            medicine: 150000,
            consultation: 250000,
            discounts: {
                "Reguler": 0.05,
                "Suite": 0.10, // 10%
                "VIP": 0.20   // 20%
            }
        }
    };

    // --- DOM Elements ---
    const patientIdInput = document.getElementById('patient-id');
    const patientInfoDiv = document.getElementById('patient-info');
    const poliSelect = document.getElementById('poli');
    const doctorSelect = document.getElementById('doctor');
    const doctorScheduleDiv = document.getElementById('doctor-schedule');
    const calculateBtn = document.getElementById('calculate-btn');
    const summarySection = document.getElementById('summary');
    const summaryContentDiv = document.getElementById('summary-content');

    // --- Event Listeners ---

    // 1. Patient ID Input
    patientIdInput.addEventListener('input', () => {
        const patientId = patientIdInput.value.toUpperCase();
        const patient = MOCK_DATA.patients[patientId];
        
        if (patient) {
            patientInfoDiv.innerHTML = `<strong>Nama:</strong> ${patient.name}<br><strong>Umur:</strong> ${patient.age}<br><strong>Jenis Kelamin:</strong> ${patient.gender}`;
            patientInfoDiv.style.display = 'block';
        } else {
            patientInfoDiv.style.display = 'none';
            patientInfoDiv.innerHTML = '';
        }
    });

    // 2. Poli Selection
    poliSelect.addEventListener('change', () => {
        const selectedPoli = poliSelect.value;
        doctorSelect.innerHTML = '<option value="">-- Pilih Dokter --</option>'; // Reset
        doctorScheduleDiv.style.display = 'none';
        doctorScheduleDiv.innerHTML = '';

        if (selectedPoli && MOCK_DATA.doctors[selectedPoli]) {
            doctorSelect.disabled = false;
            MOCK_DATA.doctors[selectedPoli].forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.name;
                option.textContent = doctor.name;
                doctorSelect.appendChild(option);
            });
        } else {
            doctorSelect.disabled = true;
        }
    });

    // 3. Doctor Selection
    doctorSelect.addEventListener('change', () => {
        const selectedPoli = poliSelect.value;
        const selectedDoctorName = doctorSelect.value;
        
        if (selectedPoli && selectedDoctorName) {
            const doctor = MOCK_DATA.doctors[selectedPoli].find(d => d.name === selectedDoctorName);
            if (doctor) {
                doctorScheduleDiv.innerHTML = `<strong>Jadwal Praktek:</strong> ${doctor.schedule}`;
                doctorScheduleDiv.style.display = 'block';
            }
        } else {
            doctorScheduleDiv.style.display = 'none';
            doctorScheduleDiv.innerHTML = '';
        }
    });

    // 4. Calculate Button
    calculateBtn.addEventListener('click', () => {
        // --- Gather all data ---
        const patientId = patientIdInput.value.toUpperCase();
        const patient = MOCK_DATA.patients[patientId];
        const poli = poliSelect.value;
        const doctor = doctorSelect.value;
        const lamaInap = parseInt(document.getElementById('lama-inap').value) || 0;
        const jenisKamar = document.getElementById('kamar').value;
        const bayarObat = document.getElementById('bayar-obat').checked;
        const bayarKonsultasi = document.getElementById('bayar-konsultasi').checked;

        // --- Validation ---
        if (!patient || !poli || !doctor) {
            alert('Harap lengkapi informasi Pasien, Poli, dan Dokter terlebih dahulu.');
            return;
        }

        // --- Calculations ---
        const hargaKamarPerMalam = MOCK_DATA.prices.rooms[jenisKamar];
        const totalBiayaKamar = lamaInap * hargaKamarPerMalam;
        const biayaObat = bayarObat ? MOCK_DATA.prices.medicine : 0;
        const biayaKonsultasi = bayarKonsultasi ? MOCK_DATA.prices.consultation : 0;
        
        const subtotal = totalBiayaKamar + biayaObat + biayaKonsultasi;
        const discountRate = (lamaInap > 0) ? (MOCK_DATA.prices.discounts[jenisKamar] || 0) : 0;
        const discountAmount = subtotal * discountRate;
        const grandTotal = subtotal - discountAmount;

        // --- Format currency ---
        const formatIDR = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

        // --- Generate Summary HTML ---
        let summaryHTML = `
            <p><strong>Nama Pasien:</strong> <span>${patient.name} (${patientId})</span></p>
            <p><strong>Poli:</strong> <span>${poli}</span></p>
            <p><strong>Dokter:</strong> <span>${doctor}</span></p>
        `;

        if (lamaInap > 0) {
            summaryHTML += `
                <p><strong>Rawat Inap:</strong> <span>${lamaInap} hari (${jenisKamar})</span></p>
                <p><strong>Biaya Kamar:</strong> <span>${formatIDR(totalBiayaKamar)}</span></p>
            `;
        } else {
            summaryHTML += `<p><strong>Rawat Inap:</strong> <span>Tidak ada</span></p>`;
        }

        if (bayarObat) {
            summaryHTML += `<p><strong>Biaya Obat:</strong> <span>${formatIDR(biayaObat)}</span></p>`;
        }
        if (bayarKonsultasi) {
            summaryHTML += `<p><strong>Biaya Konsultasi:</strong> <span>${formatIDR(biayaKonsultasi)}</span></p>`;
        }

        if (discountAmount > 0) {
            summaryHTML += `<p><strong>Subtotal:</strong> <span>${formatIDR(subtotal)}</span></p>`;
            summaryHTML += `<p class="discount-info"><strong>Diskon (${jenisKamar} ${discountRate * 100}%):</strong> <span>-${formatIDR(discountAmount)}</span></p>`;
        }

        summaryHTML += `<div id="summary-total">TOTAL: ${formatIDR(grandTotal)}</div>`;
        
        // --- Display Summary ---
        summaryContentDiv.innerHTML = summaryHTML;
        summarySection.classList.remove('hidden');
        summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});