import React from 'react';

const TEMPLATE_STYLES = {
  classic: {
    shell: 'bg-slate-100',
    sheet: 'bg-white text-gray-800',
    header: 'border-b-2 border-blue-100',
    title: 'text-blue-700',
    heading: 'text-blue-700',
    chip: 'bg-blue-100 text-blue-800',
    name: 'text-3xl font-bold'
  },
  fresh: {
    shell: 'bg-teal-50',
    sheet: 'bg-white text-slate-800',
    header: 'border-b-2 border-teal-100',
    title: 'text-teal-700',
    heading: 'text-teal-700',
    chip: 'bg-teal-100 text-teal-800',
    name: 'text-4xl font-black tracking-wide'
  },
  executive: {
    shell: 'bg-amber-50',
    sheet: 'bg-white text-stone-800',
    header: 'border-b-2 border-amber-200',
    title: 'text-stone-900',
    heading: 'text-amber-700',
    chip: 'bg-amber-100 text-amber-900',
    name: 'text-3xl font-semibold tracking-[0.08em] uppercase'
  }
};

function PreviewRow({ label, value, mutedClass }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className={`text-sm ${mutedClass}`}>{value}</p>
    </div>
  );
}

function ResumeSection({ title, content, placeholder, headingClass, mutedClass }) {
  return (
    <section className="mb-6">
      <h2 className={`mb-3 text-xl font-semibold ${headingClass}`}>{title}</h2>
      {content ? (
        <p className={`whitespace-pre-line ${mutedClass}`}>{content}</p>
      ) : (
        <p className={`text-sm italic ${mutedClass}`}>{placeholder}</p>
      )}
    </section>
  );
}

export default function ResumePreview({ data, template = 'classic' }) {
  const selectedTemplate = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.classic;
  const technicalSkills = data.technicalSkills?.filter(Boolean) || [];
  const mutedClass = template === 'fresh' ? 'text-slate-600' : 'text-gray-600';
  const placeholderClass = template === 'fresh' ? 'text-slate-400' : 'text-gray-400';

  return (
    <div className={`rounded-2xl p-4 ${selectedTemplate.shell}`}>
      <div className={`resume-preview-sheet mx-auto max-w-3xl rounded-lg p-8 font-sans shadow-lg ${selectedTemplate.sheet}`}>
        <header className={`mb-6 pb-4 ${selectedTemplate.header}`}>
          <h1 className={`${selectedTemplate.name} ${selectedTemplate.title}`}>{data.name || 'Your Name'}</h1>
          <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 ${mutedClass}`}>
            <span>{data.email || 'your.email@example.com'}</span>
            {data.phone ? <span>{data.phone}</span> : null}
            {data.location ? <span>{data.location}</span> : null}
          </div>
        </header>

        <ResumeSection
          title="Professional Summary"
          content={data.summary}
          placeholder="Add a short summary to introduce your profile."
          headingClass={selectedTemplate.heading}
          mutedClass={data.summary ? mutedClass : placeholderClass}
        />

        <section className="mb-6">
          <h2 className={`mb-3 text-xl font-semibold ${selectedTemplate.heading}`}>Education</h2>
          <div className="space-y-3">
            <PreviewRow
              label="High School"
              value={[data.highSchool, data.highSchoolMarks ? `${data.highSchoolMarks}%` : ''].filter(Boolean).join(' - ')}
              mutedClass={mutedClass}
            />
            <PreviewRow
              label="Senior Secondary"
              value={[data.seniorSecondary, data.seniorSecondaryMarks ? `${data.seniorSecondaryMarks}%` : ''].filter(Boolean).join(' - ')}
              mutedClass={mutedClass}
            />
            <PreviewRow
              label="College / University"
              value={[data.college, data.collegeMarks].filter(Boolean).join(' - ')}
              mutedClass={mutedClass}
            />
            {!data.highSchool && !data.seniorSecondary && !data.college ? (
              <p className={`text-sm italic ${placeholderClass}`}>Add education details to see them here.</p>
            ) : null}
          </div>
        </section>

        <ResumeSection
          title="Experience"
          content={data.experience}
          placeholder="Add internships, work experience, or leadership responsibilities."
          headingClass={selectedTemplate.heading}
          mutedClass={data.experience ? mutedClass : placeholderClass}
        />

        <ResumeSection
          title="Projects"
          content={data.projects}
          placeholder="Add your major projects, tools used, and outcomes."
          headingClass={selectedTemplate.heading}
          mutedClass={data.projects ? mutedClass : placeholderClass}
        />

        <ResumeSection
          title="Certifications"
          content={data.certifications}
          placeholder="Add certifications and completed courses."
          headingClass={selectedTemplate.heading}
          mutedClass={data.certifications ? mutedClass : placeholderClass}
        />

        <ResumeSection
          title="Achievements"
          content={data.achievements}
          placeholder="Add awards, competitions, or notable accomplishments."
          headingClass={selectedTemplate.heading}
          mutedClass={data.achievements ? mutedClass : placeholderClass}
        />

        <ResumeSection
          title="Skills"
          content={data.skills}
          placeholder="Add your soft skills and strengths."
          headingClass={selectedTemplate.heading}
          mutedClass={data.skills ? mutedClass : placeholderClass}
        />

        <section>
          <h2 className={`mb-3 text-xl font-semibold ${selectedTemplate.heading}`}>Technical Skills</h2>
          {technicalSkills.length ? (
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <span key={skill} className={`rounded-full px-3 py-1 text-sm font-medium ${selectedTemplate.chip}`}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className={`text-sm italic ${placeholderClass}`}>Select technical skills to show them in the resume.</p>
          )}
        </section>
      </div>
    </div>
  );
}
