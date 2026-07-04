import React from 'react';
import { Button } from './Button';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
}

export const ProjectCard = ({ title, description, tags }: ProjectCardProps) => {
  return (
    <div className="bg-[var(--color-black)] text-[var(--color-white)] border-4 border-[var(--color-white)] hard-shadow-primary p-6 sharp-corner transform transition-transform hover:-translate-y-2 relative overflow-hidden group">
      {/* Decorative Red Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] -skew-x-12 translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-300"></div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold uppercase mb-2 drop-shadow-md text-[var(--color-white)]">{title}</h3>
        <p className="text-lg mb-6 text-gray-300 font-medium">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span key={tag} className="bg-[var(--color-white)] text-[var(--color-black)] px-3 py-1 font-bold text-sm sharp-corner uppercase border-2 border-[var(--color-black)]">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <Button variant="primary" className="!text-sm !px-4 !py-2 !-skew-x-0 !border-2">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};
