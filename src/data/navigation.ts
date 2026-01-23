export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/#about', label: 'About', icon: 'user' },
  { href: '/#experience', label: 'Experience', icon: 'briefcase' },
  { href: '/#projects', label: 'Projects', icon: 'folder' },
  { href: '/#contact', label: 'Contact', icon: 'mail' },
];
