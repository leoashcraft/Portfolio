export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/#about', label: 'Offers', icon: 'user' },
  { href: '/#projects', label: 'Projects', icon: 'folder' },
  { href: '/#experience', label: 'Experience', icon: 'briefcase' },
  { href: '/#github', label: 'GitHub', icon: 'github' },
  { href: '/#contact', label: 'Contact', icon: 'mail' },
];
