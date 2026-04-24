import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const TECH_SKILLS = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'MySQL',
  'TypeScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Next.js'
];

export function createInitialForm(user) {
  return {
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    summary: '',
    highSchool: '',
    highSchoolMarks: '',
    seniorSecondary: '',
    seniorSecondaryMarks: '',
    college: '',
    collegeMarks: '',
    experience: '',
    projects: '',
    certifications: '',
    achievements: '',
    skills: '',
    technicalSkills: []
  };
}

export default function BuilderForm({ onPreviewChange, onSave }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => createInitialForm(user));
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const nextForm = createInitialForm(user);
    setForm(nextForm);
    onPreviewChange(nextForm);
  }, [onPreviewChange, user]);

  function updateForm(nextForm) {
    setForm(nextForm);
    onPreviewChange(nextForm);
  }

  function handleChange(event) {
    const nextForm = { ...form, [event.target.name]: event.target.value };
    updateForm(nextForm);
  }

  function handleSkillSelect(event) {
    const value = event.target.value;

    if (value && !form.technicalSkills.includes(value)) {
      updateForm({
        ...form,
        technicalSkills: [...form.technicalSkills, value]
      });
    }
  }

  function removeSkill(skillToRemove) {
    updateForm({
      ...form,
      technicalSkills: form.technicalSkills.filter((skill) => skill !== skillToRemove)
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    try {
      const { data } = await api.post('/resume', form);
      onSave(data);
      setStatusMessage('Resume saved successfully.');
    } catch (error) {
      setStatusMessage(error.response?.data?.error || 'Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  }

  function inputField(id, label, options = {}) {
    const { type = 'text', textarea = false, rows = 5 } = options;

    if (textarea) {
      return (
        <div key={id} className="relative">
          <textarea
            id={id}
            name={id}
            rows={rows}
            value={form[id]}
            onChange={handleChange}
            placeholder=""
            className="peer w-full rounded-xl border border-gray-300 bg-gray-50 p-4 pt-6 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor={id}
            className="absolute left-4 top-3 bg-gray-50 px-1 text-sm text-gray-500 transition-all duration-200 peer-focus:text-blue-500"
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <div key={id} className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={form[id]}
          onChange={handleChange}
          placeholder=""
          className="peer w-full rounded-xl border border-gray-300 bg-gray-50 p-4 pt-6 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor={id}
          className="absolute left-4 top-3 bg-gray-50 px-1 text-sm text-gray-500 transition-all duration-200 peer-focus:text-blue-500"
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Personal Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {inputField('name', 'Full Name')}
          {inputField('email', 'Email', { type: 'email' })}
          {inputField('phone', 'Phone Number')}
          {inputField('location', 'Location')}
        </div>
        <div className="mt-6">{inputField('summary', 'Professional Summary', { textarea: true, rows: 4 })}</div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Education</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {inputField('highSchool', 'High School Name')}
          {inputField('highSchoolMarks', 'High School Marks (%)')}
          {inputField('seniorSecondary', 'Senior Secondary School Name')}
          {inputField('seniorSecondaryMarks', 'Senior Secondary Marks (%)')}
          {inputField('college', 'College / University Name')}
          {inputField('collegeMarks', 'College CGPA / Percentage')}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Experience</h3>
        {inputField('experience', 'Experience, internships, responsibilities, impact', { textarea: true, rows: 6 })}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Projects</h3>
        {inputField('projects', 'Projects, technologies used, outcomes', { textarea: true, rows: 6 })}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Certifications</h3>
        {inputField('certifications', 'Courses, certificates, training programs', { textarea: true, rows: 4 })}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Achievements</h3>
        {inputField('achievements', 'Awards, leadership, hackathons, recognition', { textarea: true, rows: 4 })}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Skills</h3>
        {inputField('skills', 'Communication, leadership, problem solving, teamwork', { textarea: true, rows: 4 })}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Technical Skills</h3>
        <select
          value=""
          onChange={handleSkillSelect}
          className="mb-4 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a skill...</option>
          {TECH_SKILLS.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          {form.technicalSkills.map((skill) => (
            <span
              key={skill}
              className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 shadow-md"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 font-bold text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </section>

      {statusMessage ? (
        <p
          className={
            statusMessage.includes('successfully')
              ? 'text-sm font-medium text-emerald-600'
              : 'text-sm font-medium text-red-600'
          }
        >
          {statusMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-700"
      >
        {isSaving ? 'Saving...' : 'Save Resume'}
      </button>
    </form>
  );
}
