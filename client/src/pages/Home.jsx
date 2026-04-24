import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const highlights = [
  {
    title: 'Easy to Use',
    text: 'Intuitive interface lets you build your resume without any technical skills.'
  },
  {
    title: 'Modern Templates',
    text: 'Choose from professionally designed layouts to impress recruiters.'
  },
  {
    title: 'Live Preview',
    text: 'See your resume update in real time as you fill in your details.'
  }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf6ff_0%,#dbeeff_50%,#e9f4ff_100%)] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-white/80 bg-white/88 px-8 py-12 text-center shadow-[0_24px_60px_rgba(37,99,235,0.12)] backdrop-blur md:px-14">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            Resume Builder
          </span>

          <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Design Your Dream Resume
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Stand out with a professional, modern resume in just minutes.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <Link
              to={user ? '/builder' : '/auth'}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-9 py-4 text-lg font-semibold text-white shadow-[0_16px_35px_rgba(37,99,235,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              {user ? 'Open Builder' : 'Sign In to Start'}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="mb-3 text-xl font-semibold text-blue-700">{item.title}</h3>
                <p className="text-[1.02rem] leading-8 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
