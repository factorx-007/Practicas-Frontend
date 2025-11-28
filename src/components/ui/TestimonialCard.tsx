import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  initials: string;
  testimonial: string;
  rating?: number;
  colorClass?: string;
}

const TestimonialCard = ({ name, role, initials, testimonial, rating = 5, colorClass = "bg-[#567C8D]" }: TestimonialCardProps) => (
  <div className="p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: '#FFFFFF' }}>
    <div className="flex items-center mb-6">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4`}>
        {initials}
      </div>
      <div>
        <h4 className="font-semibold" style={{ color: '#2F4156' }}>{name}</h4>
        <p className="text-sm" style={{ color: '#2F4156' }}>{role}</p>
      </div>
    </div>
    {rating && (
      <div className="mb-4" style={{ color: '#567C8D' }}>
        {[...Array(rating)].map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
    )}
    <p className="italic" style={{ color: '#2F4156' }}>&quot;<span style={{ color: '#567C8D' }}>{testimonial}</span>&quot;</p>
  </div>
);

export default TestimonialCard;
