import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/' },
    { name: 'Explore Library', path: '/library' },
    { name: 'Search', path: '/search' },
    { name: 'History', path: '/history' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/90 dark:bg-surface-container-low/90 border-b border-outline-variant dark:border-outline backdrop-blur-md">
      <div className="flex justify-between items-center px-6 h-20 max-w-screen-2xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <span className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
            Vid⚡hazam
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                className={`font-body-md text-body-md transition-colors ${isActive ? 'text-primary font-bold' : 'text-on-surface hover:text-primary font-semibold'}`}
                to={link.path}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
