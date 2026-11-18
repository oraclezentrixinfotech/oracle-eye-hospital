import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const doc = new Document({
      title: "LASIK Eye Surgery in Moradabad - SEO Template",
      description: "Structured template for Oracle Eye Hospital SEO landing pages",
      sections: [
        {
          properties: {},
          children: [
            // 1. Metadata Fields
            new Paragraph({
              children: [
                new TextRun({ text: "URL: ", bold: true }),
                new TextRun("lasik-eye-surgery-in-moradabad"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "META TITLE: ", bold: true }),
                new TextRun("LASIK Eye Surgery in Moradabad | Oracle Eye Hospital"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "META DESCRIPTION: ", bold: true }),
                new TextRun(
                  "Experience blade-free Contoura Vision LASIK in Moradabad at Oracle Eye Hospital. Achieve crystal-clear spectacle freedom. Consult top surgeons today!"
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "KEYWORDS: ", bold: true }),
                new TextRun(
                  "lasik eye surgery moradabad, contoura vision moradabad, specs removal laser moradabad, best eye doctor moradabad"
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "BADGE: ", bold: true }),
                new TextRun("NABH-Aligned Super-Specialty Centre • 25,000+ Surgeries"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "H1: ", bold: true }),
                new TextRun("Advanced LASIK Eye Surgery in Moradabad"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "SUBTITLE: ", bold: true }),
                new TextRun(
                  "Experience complete freedom from spectacles with next-generation Contoura Vision and blade-free Femto-LASIK technology at Oracle Eye Hospital."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "CHIPS: ", bold: true }),
                new TextRun(
                  "Procedure Duration | 10-Min Walk-In ; Visual Recovery | 24 Hours ; Payment & TPA | 0% EMI & Cashless Insurance"
                ),
              ],
              spacing: { after: 200 },
            }),

            // 2. Highlight Callout Section
            new Paragraph({
              children: [
                new TextRun({ text: "Why Choose Oracle Eye Hospital: ", bold: true }),
                new TextRun(
                  "US-FDA approved laser technology, zero blade cuts, painless topical anesthesia, and same-day discharge."
                ),
              ],
              spacing: { before: 100, after: 200 },
            }),

            // 3. Clinical Content Section 1
            new Paragraph({
              children: [
                new TextRun({
                  text: "What is Contoura Vision and Blade-Free Femto LASIK?",
                  bold: true,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Contoura Vision is the latest technological breakthrough in laser vision correction. While conventional LASIK only corrects your spectacle power, Contoura Vision maps 22,000 elevation points on your cornea to treat microscopic corneal irregularities."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "This unique topography-guided precision results in vision that is often sharper than what you could achieve with glasses or contacts, significantly reducing night-time glare and halos."
                ),
              ],
              spacing: { after: 200 },
            }),

            // 4. Clinical Content Section 2 (Checklist)
            new Paragraph({
              children: [
                new TextRun({ text: "Key Benefits of Blade-Free LASIK", bold: true }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun("- Painless 10-minute walk-in outpatient procedure"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "- Rapid visual recovery allowing you to resume computer work in 24 to 48 hours"
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "- Complete elimination or drastic reduction of spectacle dependence"
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "- High contrast sensitivity and superior night vision quality"
                ),
              ],
              spacing: { after: 200 },
            }),

            // 5. Clinical Content Section 3 (Numbered Workflow Steps)
            new Paragraph({
              children: [
                new TextRun({ text: "Step-by-Step Surgical Workflow", bold: true }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "We ensure every patient feels comfortable, informed, and confident at each step of their laser vision journey:"
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Step 1: Comprehensive Corneal Evaluation", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Pentacam corneal tomography, pachymetry, and dilated retinal scans verify your corneal thickness and safety eligibility."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Step 2: Painless Anesthetic Eye Drops", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Gentle numbing eye drops ensure complete comfort with zero needle injections."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Step 3: Blade-Free Flap Creation", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "Femtosecond laser technology creates a microscopic, uniform corneal flap in under 10 seconds."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Step 4: Topography-Guided Laser Reshaping",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "The excimer laser gently reshapes the corneal stroma according to your personalized optical blueprint."
                ),
              ],
              spacing: { after: 200 },
            }),

            // 6. Frequently Asked Questions
            new Paragraph({
              children: [
                new TextRun({ text: "Frequently Asked Questions", bold: true }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Q: Is LASIK eye surgery painful?", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "A: No. Numbing eye drops applied before the surgery ensure you feel virtually no pain. Most patients report only mild pressure lasting a few seconds."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Q: How quickly can I resume office or screen work after LASIK?",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "A: Most patients return to normal office work, reading, and light smartphone use within 24 to 48 hours following surgery."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Q: Who is eligible for LASIK eye surgery in Moradabad?",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "A: You must be at least 18 years old, possess a stable spectacle prescription for at least 12 months, and have adequate corneal thickness determined during our pre-LASIK Pentacam evaluation."
                ),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Q: Is 0% interest EMI or insurance financing available?",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(
                  "A: Yes, Oracle Eye Hospital offers flexible zero-interest EMI financing plans and cashless assistance through empanelled healthcare partners."
                ),
              ],
              spacing: { after: 200 },
            }),

            // 7. Trailing Doctors & Related Links
            new Paragraph({
              children: [
                new TextRun({ text: "DOCTORS: ", bold: true }),
                new TextRun("Dr. Girjesh Kain, Dr. Rachana"),
              ],
              spacing: { before: 200, after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "RELATED: ", bold: true }),
                new TextRun(
                  "cataract-surgery-in-moradabad, glaucoma-treatment-in-moradabad."
                ),
              ],
              spacing: { after: 200 },
            }),
          ],
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="template.docx"',
        "Content-Length": docxBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Download Template API Error]:", err);
    return NextResponse.json(
      { error: "Failed to generate template.docx template." },
      { status: 500 }
    );
  }
}
