import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface BenefitItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  delay?: number;
}

const BenefitItem = ({ title, description, delay = 0 }: BenefitItemProps) => (
  <div className="flex items-start space-x-5 group" data-aos="fade-up" data-aos-delay={delay}>
    <div className="flex-1">
      <h3 className="text-lg md:text-xl font-semibold mb-1.5" style={{ color: '#2F4156' }}>{title}</h3>
      <p className="leading-relaxed text-sm md:text-base" style={{ color: '#2F4156' }}>{description}</p>
    </div>
  </div>
);

export default BenefitItem;
