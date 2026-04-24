import React, { useState } from 'react';
import { EnvelopeIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import api from '../api';

function buildFallbackReply({ name = '', message = '' }) {
  const displayName = name.trim() || 'there';
  const normalizedMessage = message.trim().toLowerCase();

  if (
    normalizedMessage.includes('software') &&
    normalizedMessage.includes('skill')
  ) {
    return {
      topic: 'software-role-skills',
      reply:
        'For a software role, add JavaScript, React, Node.js, SQL, Git, problem solving, debugging, and teamwork if you know them.'
    };
  }

  if (
    normalizedMessage.includes('front end') ||
    normalizedMessage.includes('frontend')
  ) {
    return {
      topic: 'frontend-skills',
      reply:
        'For a frontend role, add HTML, CSS, JavaScript, React, responsive design, Git, API integration, and UI problem solving.'
    };
  }

  if (
    normalizedMessage.includes('back end') ||
    normalizedMessage.includes('backend')
  ) {
    return {
      topic: 'backend-skills',
      reply:
        'For a backend role, add Node.js or Java/Python, APIs, databases, authentication, Git, debugging, and system thinking.'
    };
  }

  if (
    normalizedMessage.includes('summary') ||
    normalizedMessage.includes('objective')
  ) {
    return {
      topic: 'summary',
      reply:
        'Keep your summary to 2 or 3 lines: role, key skills, and what value you can bring.'
    };
  }

  if (
    normalizedMessage.includes('pdf') ||
    normalizedMessage.includes('download') ||
    normalizedMessage.includes('export')
  ) {
    return {
      topic: 'pdf',
      reply:
        `Hi ${displayName}, to download your resume PDF, complete the form, save the resume, and then click Download PDF in the builder preview panel. ` +
        `If it still does not download, refresh the page once and try again.`
    };
  }

  if (
    normalizedMessage.includes('template') ||
    normalizedMessage.includes('design') ||
    normalizedMessage.includes('style')
  ) {
    return {
      topic: 'template',
      reply:
        `Hi ${displayName}, you can choose from the available resume templates in the builder preview area. ` +
        `The selected template is applied to both the live preview and the downloaded PDF.`
    };
  }

  if (
    normalizedMessage.includes('login') ||
    normalizedMessage.includes('sign in') ||
    normalizedMessage.includes('sign up') ||
    normalizedMessage.includes('account')
  ) {
    return {
      topic: 'auth',
      reply:
        `Hi ${displayName}, after signing in, the app should open the main builder home page first. ` +
        `From there you can click Open Builder to start creating and downloading your resume.`
    };
  }

  if (
    normalizedMessage.includes('project') ||
    normalizedMessage.includes('projects')
  ) {
    return {
      topic: 'projects',
      reply:
        'Add 2 or 3 strong projects with project name, tech stack, what you built, and one result or feature.'
    };
  }

  if (
    normalizedMessage.includes('experience') ||
    normalizedMessage.includes('internship')
  ) {
    return {
      topic: 'experience',
      reply:
        'Write role, company, duration, and 2 or 3 short impact points using action words like built, improved, or developed.'
    };
  }

  if (
    normalizedMessage.includes('certification') ||
    normalizedMessage.includes('course')
  ) {
    return {
      topic: 'certifications',
      reply:
        'Add relevant certifications only, especially those connected to your target role, tools, or programming skills.'
    };
  }

  if (
    normalizedMessage.includes('achievement') ||
    normalizedMessage.includes('award')
  ) {
    return {
      topic: 'achievements',
      reply:
        'Add measurable achievements like rankings, hackathon results, leadership roles, awards, or strong academic results.'
    };
  }

  if (normalizedMessage.includes('skill')) {
    return {
      topic: 'skills',
      reply:
        'Add only the skills that match your target role and that you can explain confidently in an interview.'
    };
  }

  return {
    topic: 'general',
    reply:
      `Hi ${displayName}, ask a specific resume question like skills, projects, summary, templates, PDF, or login and I will answer briefly.`
  };
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [reply, setReply] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setReply('');
    setTopic('');

    try {
      const { data } = await api.post('/support', form);
      setReply(data.reply);
      setTopic(data.topic);
    } catch (err) {
      const fallback = buildFallbackReply(form);
      setReply(fallback.reply);
      setTopic(fallback.topic);
      setError('Live server reply is unavailable right now, so a built-in support answer is shown below.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">Get in Touch</h1>
        <p className="text-center text-gray-600 mb-8">
          Ask a question about the resume builder and get an immediate support reply on the same page.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div className="relative">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 absolute left-3 top-5" />
            <textarea
              rows="5"
              placeholder="Your Message"
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          {reply ? (
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Support Reply{topic ? ` - ${topic}` : ''}
              </p>
              <p className="mt-3 text-gray-700 leading-7">{reply}</p>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-blue-700 shadow-lg transition duration-300 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Getting Reply...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
