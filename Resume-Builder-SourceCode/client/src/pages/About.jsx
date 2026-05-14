import React from 'react';
import { BriefcaseIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/solid';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-5xl font-extrabold text-blue-700 text-center mb-8">
        About <span className="text-gray-800">Resume Builder</span>
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
        Our Resume Builder is designed to empower job seekers by simplifying the process of creating a polished and
        professional resume. Whether you're a student, recent graduate, or an experienced professional, we’ve got you
        covered.
      </p>

      <div className="grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 rounded-xl bg-blue-50 shadow hover:shadow-lg transition">
          <UserCircleIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Easy to Use</h3>
          <p className="text-gray-600 mt-2">
            Just fill out a simple form and generate a resume instantly—no design skills needed.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-blue-50 shadow hover:shadow-lg transition">
          <SparklesIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Professional Design</h3>
          <p className="text-gray-600 mt-2">
            Our templates follow modern resume standards and formatting to help you stand out.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-blue-50 shadow hover:shadow-lg transition">
          <BriefcaseIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Built for All</h3>
          <p className="text-gray-600 mt-2">
            Perfect for students, freshers, and professionals looking to create a compelling CV.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          With a clean interface, real-time preview, and customizable options, our tool ensures that your resume reflects your unique qualifications and stands out to recruiters.
        </p>
      </div>
    </div>
  );
}
