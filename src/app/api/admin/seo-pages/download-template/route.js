import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const doc = new Document({
      title: "SEO Landing Page Content Template",
      description: "Structured template for Oracle Eye Hospital SEO landing pages",
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: "ORACLE EYE HOSPITAL — SEO PAGE CONTENT TEMPLATE",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Guidance: Fill in each section below. This document is formatted for direct smart import into the Admin Panel (/admin/seo-pages).",
                  italics: true,
                  color: "666666",
                  size: 20,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Section 1: Page Title & Slug
            new Paragraph({
              text: "1. Page Title & URL Slug",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Page Title (H1): ", bold: true }),
                new TextRun("Advanced Cataract Surgery in Moradabad"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Guidance: ", italics: true, color: "008899" }),
                new TextRun({
                  text: "Enter a clear, primary clinical keyword-rich title for your H1 heading.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "URL Slug: ", bold: true }),
                new TextRun("cataract-surgery-in-moradabad"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Guidance: ", italics: true, color: "008899" }),
                new TextRun({
                  text: "Lowercase alphanumeric with hyphens. Keep it concise, e.g. /lasik-surgery-in-moradabad.",
                  italics: true,
                  color: "555555",
                }),
              ],
              spacing: { after: 300 },
            }),

            // Section 2: Meta Tags
            new Paragraph({
              text: "2. SEO & Metadata",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Meta Title (Max 60 chars): ", bold: true }),
                new TextRun("Cataract Surgery in Moradabad | Oracle Eye Hospital"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Guidance: ", italics: true, color: "008899" }),
                new TextRun({
                  text: "Keep under 60 characters for optimal display on Google SERPs.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Meta Description (Max 160 chars): ", bold: true }),
                new TextRun(
                  "Looking for advanced cataract surgery in Moradabad? Oracle Eye Hospital offers 10-minute stitchless phaco surgery, robotic precision & premium foldable IOLs."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Guidance: ", italics: true, color: "008899" }),
                new TextRun({
                  text: "Aim for 140–160 characters highlighting patient benefits, safety, and a clear call to action.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Keywords (comma-separated): ", bold: true }),
                new TextRun(
                  "cataract surgery moradabad, phaco surgery, eye hospital moradabad, best eye surgeon, robotic cataract"
                ),
              ],
              spacing: { after: 300 },
            }),

            // Section 3: Hero Banner
            new Paragraph({
              text: "3. Hero Banner & Key Highlights",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Hero Badge: ", bold: true }),
                new TextRun("NABH-Accredited Eye Hospital in Moradabad"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Hero Heading: ", bold: true }),
                new TextRun("Advanced Cataract Surgery in Moradabad"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Hero Subheading: ", bold: true }),
                new TextRun(
                  "Restore crystal-clear vision with 10-minute micro-incision phacoemulsification surgery. 100% stitchless, painless, injection-free with premium foldable IOLs."
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Primary Button Text: ", bold: true }),
                new TextRun("Book Appointment"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Primary Button Link: ", bold: true }),
                new TextRun("https://www.oracleeyehospital.com/"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Helpline Phone: ", bold: true }),
                new TextRun("+91 8006803111"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Stat Chips (Badge Highlights):", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Procedure Duration: "),
                new TextRun({ text: "15-Min Walk-In", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Surgical Technique: "),
                new TextRun({ text: "Stitchless & Painless", bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Insurance Support: "),
                new TextRun({ text: "Cashless & TPA", bold: true }),
              ],
              spacing: { after: 300 },
            }),

            // Section 4: Content Sections (H2/H3 + Paragraphs)
            new Paragraph({
              text: "4. Clinical Content Sections (H2 / H3 & Detailed Paragraphs)",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Guidance: Structure your article with clear H2 and H3 clinical headings, followed by informative paragraphs and bullet points.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              text: "What Is Cataract Surgery & How Does It Work?",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 150, after: 80 },
            }),
            new Paragraph({
              text: "A cataract occurs when the eye's natural crystalline lens becomes cloudy or opaque, usually due to aging, trauma, or metabolic factors like diabetes. Modern phacoemulsification utilizes high-frequency ultrasound energy to gently break up the clouded natural lens through a microscopic incision of less than 2.2 mm.",
            }),
            new Paragraph({
              text: "Advanced Intraocular Lens (IOL) Options",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 100, after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun("• Monofocal IOLs: Clear distance vision; reading glasses typically needed."),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Toric IOLs: Specially engineered to correct pre-existing corneal astigmatism."),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Multifocal & Trifocal IOLs: Full spectacle freedom for near, intermediate, and distance vision."),
              ],
              spacing: { after: 300 },
            }),

            // Section 5: FAQs (Q&A)
            new Paragraph({
              text: "5. Frequently Asked Questions (FAQs)",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Guidance: Provide 4 to 8 high-intent questions and authoritative clinical answers for FAQ Schema markup.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Q1: Is cataract surgery painful?", bold: true }),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun("A1: Not at all. The entire procedure is performed under topical anesthetic eye drops without needles or injections. Most patients feel minimal pressure during the 10-minute surgery."),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Q2: How fast is recovery after modern cataract surgery?", bold: true }),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun("A2: Most patients experience significantly sharper vision within 24 to 48 hours and can resume light reading and walking the very next day."),
              ],
              spacing: { after: 300 },
            }),

            // Section 6: Specialist Doctors
            new Paragraph({
              text: "6. Specialist Doctors",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Guidance: Link the senior ophthalmic surgeons and consultants who perform this treatment.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Dr. Girjesh Kain — Senior Phaco & Refractive Surgeon (MBBS, MS Ophthalmology, 25,000+ Surgeries)"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Dr. Akansha Kain — Senior Cornea & Anterior Segment Specialist (MBBS, MS Ophthalmology)"),
              ],
              spacing: { after: 300 },
            }),

            // Section 7: Related Pages & Custom Links
            new Paragraph({
              text: "7. Related Pages & Custom Links",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Guidance: Select published SEO landing pages or provide custom links for cross-service internal linking.",
                  italics: true,
                  color: "555555",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• /lasik-eye-surgery-in-moradabad (Blade-Free Contoura Vision LASIK)"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• /glaucoma-treatment-in-moradabad (Advanced IOP Management & Laser Trabeculoplasty)"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("• Custom Link: Comprehensive Eye Checkup (https://www.oracleeyehospital.com/)"),
              ],
              spacing: { after: 300 },
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
        "Content-Disposition": 'attachment; filename="sample.docx"',
        "Content-Length": docxBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Download Template API Error]:", err);
    return NextResponse.json(
      { error: "Failed to generate sample.docx template." },
      { status: 500 }
    );
  }
}
