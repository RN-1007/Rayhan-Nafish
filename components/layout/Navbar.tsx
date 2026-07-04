import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'SKILLS', href: '/skills' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <nav className="w-full bg-[var(--color-black)] text-[var(--color-white)] border-b-4 border-[var(--color-white)] fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-3xl tracking-tighter uppercase transform -skew-x-12 relative group">
              <span className="text-[var(--color-white)] relative z-10">PORTFOLIO</span>
              <span className="absolute top-1 left-1 text-[var(--color-primary)] -z-0">PORTFOLIO</span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 font-bold text-lg uppercase transition-colors duration-200 hover:bg-[var(--color-primary)] hover:text-[var(--color-white)] sharp-corner inline-block transform -skew-x-12"
              >
                <span className="skew-x-12 inline-block">{link.name}</span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  );
};
