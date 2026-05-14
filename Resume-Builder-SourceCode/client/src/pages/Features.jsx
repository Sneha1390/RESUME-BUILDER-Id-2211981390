import React from 'react';
import {
  EyeIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: "Real-time Preview",
    description: "Instantly see how your resume looks as you type. No need to save or refresh — it's live!",
    icon: EyeIcon,
  },
  {
    title: "Pre-built Templates",
    description: "Choose from elegant, ATS-friendly templates designed by professionals for every industry.",
    icon: DocumentTextIcon,
  },
  {
    title: "Export as PDF",
    description: "Download a polished PDF version of your resume that’s ready to share with employers.",
    icon: ArrowDownTrayIcon,
  },
  {
    title: "AI-Powered Suggestions",
    description: "Get smart suggestions to improve your resume content using AI enhancements.",
    icon: SparklesIcon,
  },
  {
    title: "Customizable Layout",
    description: "Easily adjust sections, fonts, and themes to match your personal brand.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    title: "Collaboration Ready",
    description: "Share your resume draft with mentors or peers and gather feedback live.",
    icon: UserGroupIcon,
  }
];

export default function Features() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-16">
          Why Choose Our Resume Builder?
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">{feature.title}</h2>
              <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
