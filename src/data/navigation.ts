export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/#about', label: 'About', icon: 'user' },
  { href: '/projects', label: 'Projects', icon: 'folder' },
  { href: '/blog', label: 'Blog', icon: 'edit' },
  { href: '/#contact', label: 'Contact', icon: 'mail' },
];
