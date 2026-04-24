import jsPDF from 'jspdf';
import React, { useState } from 'react';
import BuilderForm, { createInitialForm } from '../components/BuilderForm';
import ResumePreview from '../components/ResumePreview';
import { useAuth } from '../AuthContext';

const TEMPLATE_OPTIONS = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean blue headings with a traditional professional layout.',
    titleColor: [29, 78, 216],
    bodyColor: [75, 85, 99],
    lineColor: [191, 219, 254]
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description: 'Soft teal accents with a bright clean layout.',
    titleColor: [15, 118, 110],
    bodyColor: [71, 85, 105],
    lineColor: [153, 246, 228]
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Warm neutral palette for a polished formal resume.',
    titleColor: [180, 83, 9],
    bodyColor: [68, 64, 60],
    lineColor: [253, 230, 138]
  }
];

function createFileName(name) {
  return (name || 'resume').replace(/[<>:"/\\|?*]+/g, '').trim() || 'resume';
}

export default function Builder() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(() => createInitialForm(user));
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [downloadMessage, setDownloadMessage] = useState('');

  async function handleDownloadPdf() {
    setDownloadMessage('Preparing your PDF...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const activeTemplate =
        TEMPLATE_OPTIONS.find((template) => template.id === selectedTemplate) || TEMPLATE_OPTIONS[0];
      const pageWidth = pdf.internal.pageSize.getWidth() - 24;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 12;
      const topMargin = 16;
      const bottomMargin = 14;
      let cursorY = topMargin;

      function ensureSpace(requiredHeight = 8) {
        if (cursorY + requiredHeight <= pageHeight - bottomMargin) {
          return;
        }

        pdf.addPage();
        cursorY = topMargin;
      }

      function addWrappedText(text, options = {}) {
        const {
          fontSize = 11,
          color = activeTemplate.bodyColor,
          lineHeight = 5.5,
          indent = 0,
          bold = false
        } = options;

        if (!text) {
          return;
        }

        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...color);

        const lines = pdf.splitTextToSize(text, pageWidth - indent);
        lines.forEach((line) => {
          ensureSpace(lineHeight);
          pdf.text(line, marginX + indent, cursorY);
          cursorY += lineHeight;
        });
      }

      function addSection(title, content) {
        if (!content || !String(content).trim()) {
          return;
        }

        ensureSpace(12);
        cursorY += 2;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(...activeTemplate.titleColor);
        pdf.text(title, marginX, cursorY);
        cursorY += 2;
        pdf.setDrawColor(...activeTemplate.lineColor);
        pdf.line(marginX, cursorY + 1.5, marginX + pageWidth, cursorY + 1.5);
        cursorY += 6;
        addWrappedText(String(content).trim(), { fontSize: 10.5, lineHeight: 5.2 });
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(selectedTemplate === 'fresh' ? 24 : 22);
      pdf.setTextColor(...activeTemplate.titleColor);
      pdf.text(resumeData.name || 'Your Name', marginX, cursorY);
      cursorY += 8;

      const contactLine = [resumeData.email, resumeData.phone, resumeData.location].filter(Boolean).join('  |  ');
      if (contactLine) {
        addWrappedText(contactLine, { fontSize: 10.5, color: activeTemplate.bodyColor });
      }
      cursorY += 2;

      addSection('Professional Summary', resumeData.summary);

      const educationEntries = [
        ['High School', [resumeData.highSchool, resumeData.highSchoolMarks ? `${resumeData.highSchoolMarks}%` : ''].filter(Boolean).join(' - ')],
        ['Senior Secondary', [resumeData.seniorSecondary, resumeData.seniorSecondaryMarks ? `${resumeData.seniorSecondaryMarks}%` : ''].filter(Boolean).join(' - ')],
        ['College / University', [resumeData.college, resumeData.collegeMarks].filter(Boolean).join(' - ')]
      ].filter(([, value]) => value);

      if (educationEntries.length) {
        ensureSpace(12);
        cursorY += 2;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(...activeTemplate.titleColor);
        pdf.text('Education', marginX, cursorY);
        cursorY += 2;
        pdf.setDrawColor(...activeTemplate.lineColor);
        pdf.line(marginX, cursorY + 1.5, marginX + pageWidth, cursorY + 1.5);
        cursorY += 6;

        educationEntries.forEach(([label, value]) => {
          addWrappedText(`${label}: ${value}`, { fontSize: 10.5, lineHeight: 5.2, bold: true });
        });
      }

      addSection('Experience', resumeData.experience);
      addSection('Projects', resumeData.projects);
      addSection('Certifications', resumeData.certifications);
      addSection('Achievements', resumeData.achievements);
      addSection('Skills', resumeData.skills);

      if (resumeData.technicalSkills?.length) {
        addSection('Technical Skills', resumeData.technicalSkills.join(', '));
      }

      pdf.save(`${createFileName(resumeData.name)}-${selectedTemplate}.pdf`);
      setDownloadMessage('PDF downloaded successfully.');
    } catch (error) {
      console.error('PDF download failed:', error);
      setDownloadMessage('Unable to download PDF right now.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="text-center">
          <h1 className="mb-4 text-5xl font-extrabold text-blue-700 drop-shadow-sm">Build Your Perfect Resume</h1>
          <p className="text-lg text-gray-600">
            Fill in detailed resume sections, switch templates, preview live, then save and download your PDF resume.
          </p>
          <p className="mt-3 text-sm font-medium text-blue-700">
            Signed in as {user?.fullName} ({user?.email})
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Fill in Your Information</h2>
              <p className="mt-1 text-sm text-gray-500">The preview on the right updates as you type.</p>
            </div>

            <BuilderForm onPreviewChange={setResumeData} onSave={setResumeData} />
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-2xl">
            <div className="mb-6 space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">Live Resume Preview</h2>
                  <p className="mt-1 text-sm text-gray-500">Choose a template and preview your resume before downloading.</p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                >
                  Download PDF
                </button>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Choose Template</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {TEMPLATE_OPTIONS.map((template) => {
                    const active = selectedTemplate === template.id;

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <p className="text-base font-bold text-gray-900">{template.name}</p>
                        <p className="mt-2 text-sm text-gray-500">{template.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {downloadMessage ? <p className="mb-4 text-sm font-medium text-emerald-600">{downloadMessage}</p> : null}

            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}
