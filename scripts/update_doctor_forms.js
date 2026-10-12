const fs = require('fs');

const doctors = [
  { name: 'Dr. Girjesh Kain', files: ['src/app/girjesh-kain/page.jsx', 'src/app/doctors/girjesh-kain/page.jsx'] },
  { name: 'Dr. Rachana', files: ['src/app/rachana/page.jsx', 'src/app/doctors/rachana/page.jsx'] },
  { name: 'Dr. Ramesh Kumar', files: ['src/app/ramesh-kumar/page.jsx', 'src/app/doctors/ramesh-kumar/page.jsx'] },
  { name: 'Dr. Sujata Tomar', files: ['src/app/sujata-tomar/page.jsx', 'src/app/doctors/sujata-tomar/page.jsx'] },
];

for (const doc of doctors) {
  for (const file of doc.files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // Add import if not present
    if (!content.includes('DoctorBookingForm')) {
      content = 'import DoctorBookingForm from "@/components/DoctorBookingForm";\n' + content;
    }

    // Replace form block
    const formRegex = /<form id="bookingForm"[\s\S]*?<\/form>/;
    if (formRegex.test(content)) {
      content = content.replace(formRegex, `<DoctorBookingForm doctorName="${doc.name}" />`);
    }

    // Fix any stray </div>s typo
    content = content.replace(/<\/div>s\s*<div/g, '</div>\n\t\t\t\t\t\t\t\t\t\t<div');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file} with DoctorBookingForm for ${doc.name}`);
  }
}
