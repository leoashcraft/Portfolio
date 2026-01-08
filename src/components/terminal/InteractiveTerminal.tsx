import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { profile } from '../../data/profile';
import { experience, education, certifications, passions } from '../../data/experience';
import { skills, technologies } from '../../data/skills';

type OutputLine = {
  type: 'input' | 'output' | 'error' | 'ascii';
  content: string;
};

const ASCII_ART = `
 _                  _         _                   __ _
| |    ___  ___    / \\   ___| |__   ___ _ __ __ _ / _| |_
| |   / _ \\/ _ \\  / _ \\ / __| '_ \\ / __| '__/ _\` | |_| __|
| |__|  __/ (_) |/ ___ \\\\__ \\ | | | (__| | | (_| |  _| |_
|_____\\___|\\___//_/   \\_\\___/_| |_|\\___|_|  \\__,_|_|  \\__|

Welcome to my interactive portfolio terminal!
Type 'help' to see available commands.
`;

const commands: Record<string, () => string> = {
  help: () => `
Available commands:
  help        Show this help message
  about       Learn about me
  skills      View my technical skills
  experience  View my work experience
  projects    Browse my projects
  contact     Get my contact info
  resume      Download my resume
  social      View social links
  clear       Clear the terminal
`,

  about: () => `
╔══════════════════════════════════════════════════════════════╗
║                       ABOUT ME                               ║
╚══════════════════════════════════════════════════════════════╝

${profile.name}
${profile.title}
📍 ${profile.location}

${profile.bio}

📊 Stats:
   • ${profile.stats[0].value}+ years of tech experience
   • ${profile.stats[1].value}+ years of development
   • ${profile.stats[2].value}+ years in management
   • ${profile.stats[3].value}+ products launched

Type 'skills' to see my technical stack or 'experience' for work history.
`,

  skills: () => `
╔══════════════════════════════════════════════════════════════╗
║                    TECHNICAL SKILLS                          ║
╚══════════════════════════════════════════════════════════════╝

Languages:
${skills[0].skills.map((s) => `  ${s.name.padEnd(15)} ${'█'.repeat(Math.floor(s.level / 10))}${'░'.repeat(10 - Math.floor(s.level / 10))} ${s.level}%`).join('\n')}

Frameworks & Libraries:
${skills[1].skills.map((s) => `  ${s.name.padEnd(15)} ${'█'.repeat(Math.floor(s.level / 10))}${'░'.repeat(10 - Math.floor(s.level / 10))} ${s.level}%`).join('\n')}

Technologies: ${technologies.slice(0, 12).join(' • ')}
`,

  experience: () => `
╔══════════════════════════════════════════════════════════════╗
║                    WORK EXPERIENCE                           ║
╚══════════════════════════════════════════════════════════════╝

${experience
    .slice(0, 3)
    .map(
      (exp) => `
┌─ ${exp.company} ─────────────────────────
│  ${exp.position}
│  ${exp.period}
│
${exp.highlights.slice(0, 2).map((h) => `│  • ${h.slice(0, 60)}${h.length > 60 ? '...' : ''}`).join('\n')}
└────────────────────────────────────────────
`
    )
    .join('')}

Type 'projects' to see my portfolio work.
`,

  projects: () => `
╔══════════════════════════════════════════════════════════════╗
║                      PROJECTS                                ║
╚══════════════════════════════════════════════════════════════╝

1. Parker University Web Systems
   Full-stack development for multiple university domains
   Stack: PHP, Laravel, WordPress, Salesforce API

2. Strategic Fulfillment Group
   Laravel backend with HubSpot CRM integration
   Stack: Laravel, PHP, HubSpot API

3. Personal Family Organizer
   React-based family management application
   Stack: React, TypeScript, Node.js

4. DOCX Search & Replace Tool
   Python utility for batch document processing
   Stack: Python, python-docx

Visit /projects for detailed case studies with metrics.
`,

  contact: () => {
    const email = profile.contact.email.user.split('').reverse().join('') + '@' + profile.contact.email.website.split('').reverse().join('');
    const phone = profile.contact.phone.user + ' ' + profile.contact.phone.website;

    return `
╔══════════════════════════════════════════════════════════════╗
║                      CONTACT ME                              ║
╚══════════════════════════════════════════════════════════════╝

📧 Email:    ${email}
📱 Phone:    ${phone}
📍 Location: ${profile.location}

Or scroll down to use the contact form!
`;
  },

  resume: () => `
📄 Resume Download

Opening resume in new tab...
(If popup blocked, visit: ${profile.resumeUrl})

[Downloading Ashcraft-Leo-Resume.pdf]
`,

  social: () => `
╔══════════════════════════════════════════════════════════════╗
║                    SOCIAL LINKS                              ║
╚══════════════════════════════════════════════════════════════╝

🔗 LinkedIn: ${profile.social.linkedin}
🐙 GitHub:   ${profile.social.github}

Feel free to connect!
`,

  employer: () => {
    const current = experience.find(e => e.endDate === 'Current');
    if (!current) return 'Currently seeking new opportunities!';
    return `
╔══════════════════════════════════════════════════════════════╗
║                  CURRENT EMPLOYER                            ║
╚══════════════════════════════════════════════════════════════╝

🏢 ${current.company}
💼 ${current.position}
📅 ${current.period}
📍 ${current.location || 'Remote'}

Key Responsibilities:
${current.highlights.map(h => `  • ${h}`).join('\n')}

Type 'employment' for full work history.
`;
  },

  employment: () => `
╔══════════════════════════════════════════════════════════════╗
║                  EMPLOYMENT HISTORY                          ║
╚══════════════════════════════════════════════════════════════╝

${experience.map(exp => `
┌─ ${exp.company} ${'─'.repeat(Math.max(0, 45 - exp.company.length))}
│  💼 ${exp.position}
│  📅 ${exp.period}
│  📍 ${exp.location || 'Remote'}
└${'─'.repeat(50)}
`).join('')}
Total: ${experience.length} positions | ${profile.stats[0].value}+ years in tech
`,

  education: () => `
╔══════════════════════════════════════════════════════════════╗
║                     EDUCATION                                ║
╚══════════════════════════════════════════════════════════════╝

${education.map(edu => `
🎓 ${edu.degree}
   ${edu.institution} (${edu.year})
   ${edu.description}

   Skills: ${edu.skills.join(' • ')}
`).join('\n')}
Type 'certifications' for professional certifications.
`,

  certifications: () => `
╔══════════════════════════════════════════════════════════════╗
║                  CERTIFICATIONS                              ║
╚══════════════════════════════════════════════════════════════╝

${certifications.map(cert => `
📜 ${cert.name}
   Issuer: ${cert.issuer}
   Year: ${cert.year}
   Status: ${cert.credentialId}
`).join('\n')}
`,

  passions: () => `
╔══════════════════════════════════════════════════════════════╗
║                  WHAT DRIVES ME                              ║
╚══════════════════════════════════════════════════════════════╝

${passions.map(p => `${p.icon} ${p.name}
   ${p.description}
`).join('\n')}
These passions fuel my work every day!
`,

  techstack: () => `
╔══════════════════════════════════════════════════════════════╗
║                    TECH STACK                                ║
╚══════════════════════════════════════════════════════════════╝

Languages:
  ${technologies.filter(t => ['PHP', 'JavaScript', 'TypeScript', 'Python', 'SQL'].includes(t)).join(' • ')}

Frontend:
  React • Vue.js • Next.js • Tailwind CSS • HTML5 • CSS3

Backend:
  Laravel • Node.js • WordPress • REST APIs • GraphQL

Databases:
  MySQL • PostgreSQL • MongoDB • Redis

DevOps & Tools:
  Docker • AWS • Git • GitHub • Jenkins • CI/CD

CRM & Integration:
  Salesforce • HubSpot • Twilio • SearchStax

Currently exploring: Astro, Three.js, AI/ML integrations
`,

  repos: () => `
╔══════════════════════════════════════════════════════════════╗
║                  GITHUB REPOSITORIES                         ║
╚══════════════════════════════════════════════════════════════╝

🔗 github.com/leoashcraft

Featured Repos:
  📁 Portfolio          This website! Astro + Three.js + React
  📁 DOCX-Tool          Python batch document processor
  📁 Family-Organizer   React family management app

Stats: Check the GitHub section on the homepage for live data!

Visit: ${profile.social.github}
`,

  cv: () => `
📄 CV/Resume Download

Opening resume in new tab...
(If popup blocked, visit: ${profile.resumeUrl})

[Downloading Ashcraft-Leo-Resume.pdf]
`,

  neofetch: () => `
        .--.          leo@portfolio
       |o_o |         ──────────────
       |:_/ |         OS: macOS (brain runs on coffee)
      //   \\ \\        Host: Dallas-Fort Worth, TX
     (|     | )       Kernel: ${profile.stats[0].value}+ years experience
    /'\\_   _/\`\\       Uptime: Since 2009
    \\___)=(___/       Packages: ${technologies.length} technologies
                      Shell: zsh + oh-my-zsh
   ${profile.name}    Resolution: 4K problems daily
   ${profile.title}   DE: VS Code + Dark Mode
                      Terminal: This one!
                      CPU: Highly caffeinated
                      Memory: Stack Overflow cached
`,

  whoami: () => `You are a visitor exploring Leo Ashcraft's portfolio.
Or are you a recruiter? A potential collaborator?
Either way, welcome! 👋`,

  sudo: () => `Nice try! 🔒
But seriously, I'm flattered you thought I'd leave that open.`,

  matrix: () => `
🐇 Follow the white rabbit...

01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100

(That's "Hello World" in binary)

There is no spoon. 🥄
`,

  // Classic terminal commands
  ifconfig: () => `
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.337  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::1337:dead:beef:cafe  prefixlen 64  scopeid 0x20<link>
        ether de:ad:be:ef:ca:fe  txqueuelen 1000  (Ethernet)
        RX packets 1337420  bytes 69696969 (69.6 MB)
        TX packets 420420  bytes 42424242 (42.4 MB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)

Note: These aren't real IPs. Nice try though! 😉
`,

  ip: () => commands.ifconfig(),

  ls: () => `
drwxr-xr-x  about/
drwxr-xr-x  experience/
drwxr-xr-x  projects/
drwxr-xr-x  skills/
-rw-r--r--  resume.pdf
-rw-r--r--  contact.txt
-rw-r--r--  README.md
drwxr-xr-x  .secrets/        <- Nice try 👀
`,

  'ls -la': () => commands.ls(),
  'ls -a': () => commands.ls(),
  dir: () => commands.ls(),

  pwd: () => `/home/leo/portfolio
(You are here! 🏠)`,

  cd: () => `bash: cd: nowhere to go, you're already at the best place!`,

  cat: () => `Usage: cat <filename>
Try: cat readme.md | cat resume.pdf | cat secrets.txt`,

  'cat readme.md': () => `
# Leo Ashcraft's Portfolio

Welcome! This is my interactive terminal portfolio.

## Quick Start
- Type 'help' for available commands
- Type 'about' to learn about me
- Type 'contact' to get in touch

Built with: Astro, React, Three.js, TypeScript, and ☕
`,

  'cat resume.pdf': () => `[Binary file - use 'resume' command to download]`,

  'cat secrets.txt': () => `Nice try! 🔒
The secret is: there is no secret. Just hard work and coffee.`,

  'cat /etc/passwd': () => `root:x:0:0:root:/root:/bin/bash
leo:x:1000:1000:Leo Ashcraft,,,:/home/leo:/bin/zsh
coffee:x:1001:1001:Essential Service:/dev/null:/bin/espresso

Just kidding. This is a portfolio, not a server! 😄`,

  date: () => {
    const now = new Date();
    return now.toString();
  },

  uptime: () => `
 ${new Date().toLocaleTimeString()} up ${Math.floor(Math.random() * 365)} days, ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')},  1 user,  load average: 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(Math.random() * 99)}

Actually, I've been coding for ${profile.stats[0].value}+ years. That's the real uptime! 💪
`,

  top: () => `
  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1337 leo       20   0  420.0m  69.0m  42.0m S  99.9  13.37  9001:00 coding
 1338 leo       20   0  256.0m  64.0m  32.0m S  42.0   8.00   420:00 debugging
 1339 leo       20   0  128.0m  32.0m  16.0m S  25.0   4.00   180:00 coffee
 1340 leo       20   0   64.0m  16.0m   8.0m S  10.0   2.00    60:00 meetings
 1341 leo       20   0   32.0m   8.0m   4.0m S   5.0   1.00    30:00 stackoverflow

Press 'q' to quit... just kidding, this isn't real top 😄
`,

  htop: () => commands.top(),
  ps: () => commands.top(),

  ping: () => `
PING google.com (142.250.80.46): 56 data bytes
64 bytes from 142.250.80.46: icmp_seq=0 ttl=117 time=4.20 ms
64 bytes from 142.250.80.46: icmp_seq=1 ttl=117 time=6.90 ms
64 bytes from 142.250.80.46: icmp_seq=2 ttl=117 time=13.37 ms
^C
--- google.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss

Spoiler: This portfolio doesn't actually have network access 🌐
`,

  curl: () => `
curl: try 'curl https://ashcraft.tech' to visit my site!
Or just scroll around - you're already here! 🎉
`,

  wget: () => commands.curl(),

  git: () => `
usage: git <command>

Try:
  git status    - See what's happening
  git log       - View commit history
  git blame     - It's always DNS

Or visit: ${profile.social.github}
`,

  'git status': () => `
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   career.js
        new file:   awesome-projects.ts
        deleted:    bugs.log

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        future-plans/
        coffee-consumption.log
`,

  'git log': () => `
commit 7h1s1s4h4sh (HEAD -> main, origin/main)
Author: Leo Ashcraft <leo@ashcraft.tech>
Date:   ${new Date().toDateString()}

    Made everything awesome ✨

commit c0ff33c0d3
Author: Leo Ashcraft <leo@ashcraft.tech>
Date:   Yesterday

    Fixed bugs, added features, drank coffee

commit d34db33f
Author: Leo Ashcraft <leo@ashcraft.tech>
Date:   Last week

    Initial commit (it worked on my machine)
`,

  'git blame': () => `It's always DNS. Or cache. Clear your cache.`,

  'git push': () => `Everything up-to-date (your career is already pushed to production!)`,

  npm: () => `
npm commands available:
  npm install   - Install dependencies
  npm start     - Start the dev server
  npm run build - Build for production
  npm audit     - Check for vulnerabilities

Pro tip: This portfolio was built with npm! 📦
`,

  'npm install': () => `
added 420 packages, removed 69 vulnerabilities

   ╭──────────────────────────────────────────╮
   │                                          │
   │   Successfully installed dependencies!   │
   │                                          │
   │   Now run: npm run hire-leo              │
   │                                          │
   ╰──────────────────────────────────────────╯
`,

  'npm start': () => `
> portfolio@1.0.0 start
> astro dev

  🚀 Server running at http://localhost:4321

  Wait... you're already here! 🎉
`,

  'npm run build': () => `
> portfolio@1.0.0 build
> astro build

✓ Built in 4.20s
✓ 69 pages generated
✓ 0 errors (because Leo writes clean code)
`,

  man: () => `
What manual page do you want?

Try:
  man leo        - Learn about me
  man portfolio  - About this site
  man life       - The meaning of it all
`,

  'man leo': () => commands.about(),
  'man portfolio': () => `
PORTFOLIO(1)              Leo's Documentation              PORTFOLIO(1)

NAME
       portfolio - An interactive developer portfolio

SYNOPSIS
       portfolio [--hire-me] [--view-projects] [--contact]

DESCRIPTION
       A cutting-edge portfolio built with Astro, React, Three.js,
       and way too much coffee. Features an interactive terminal
       (you're using it!), 3D animations, and actual useful content.

AUTHOR
       Written by Leo Ashcraft with assistance from AI and caffeine.

SEE ALSO
       about(1), skills(1), projects(1), contact(1)
`,

  'man life': () => `
The meaning of life is... 42.
Also: coffee, coding, and continuous learning.
`,

  vim: () => `
~
~
~                    VIM - Vi IMproved
~
~                    type :q! to exit
~                    (good luck with that)
~
~                    Or just use VS Code like a normal person 😉
~
`,

  nano: () => `GNU nano is nice but have you tried VS Code?`,
  emacs: () => `Emacs? I see you like to live dangerously. VS Code gang here.`,
  code: () => `VS Code is already open in another dimension where I'm writing more code.`,

  'rm -rf /': () => `
Nice try! 🛡️

sudo rm -rf / --no-preserve-root
Password: ********
rm: cannot remove '/': Permission denied

(This portfolio has plot armor)
`,

  rm: () => `rm: missing operand\nTry 'rm -rf /' for fun... just kidding, don't.`,

  exit: () => `
Logout? But you just got here! 😢

Here are some reasons to stay:
  • Free coffee (virtually)
  • Great conversation
  • No ads
  • Cool 3D graphics

Type 'stay' to remain or just close the tab (but please don't).
`,

  stay: () => `Yay! Thanks for staying! 🎉 Type 'help' to explore more.`,
  quit: () => commands.exit(),
  logout: () => commands.exit(),

  history: () => `
    1  help
    2  about
    3  skills
    4  sudo rm -rf /
    5  why isn't this working
    6  stackoverflow please help
    7  it works now (no idea why)
    8  coffee
    9  git push --force (oops)
   10  history

(Your actual command history is stored locally in this session)
`,

  echo: () => `echo what? Try: echo hello`,
  'echo hello': () => `hello`,
  'echo $PATH': () => `/usr/local/bin:/usr/bin:/bin:/home/leo/scripts:/road/to/success`,
  'echo $HOME': () => `/home/leo (but Dallas-Fort Worth IRL 🏠)`,

  cowsay: () => `
 _______________________________________
< Hire Leo! He's mass cool. >
 ---------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`,

  fortune: () => {
    const fortunes = [
      "A great developer is in your future... oh wait, you found one!",
      "The code you seek is closer than you think. Try 'projects'.",
      "Coffee in your past, code in your future.",
      "You will hire an excellent developer today. (hint: type 'contact')",
      "A wise developer once said: 'It works on my machine.'",
      "Your lucky numbers are: 127.0.0.1",
      "The bug is not in the code, it's in the requirements.",
      "Ctrl+C Ctrl+V is not a sin, it's efficiency.",
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  },

  sl: () => `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__

Choo choo! 🚂 (You typed 'sl' instead of 'ls')
`,

  ssh: () => `ssh: connect to host awesome-company.com port 22: Connection established
Welcome! You've successfully SSH'd into my portfolio.
Type 'help' for available commands.`,

  chmod: () => `chmod: changing permissions of 'portfolio': Operation awesome`,
  chown: () => `chown: changing ownership to 'you': Welcome aboard!`,

  grep: () => `Usage: grep <pattern>
Try: grep skills | grep awesome | grep hire`,
  'grep skills': () => commands.skills(),
  'grep awesome': () => `Found 420 instances of 'awesome' in Leo's portfolio.`,
  'grep hire': () => `Found 1 perfect candidate. Type 'contact' to proceed.`,

  whoami: () => `You are a visitor exploring Leo Ashcraft's portfolio.
Or are you a recruiter? A potential collaborator?
Either way, welcome! 👋`,

  sudo: () => `[sudo] password for user: ********
Sorry, user is not in the sudoers file. This incident will be reported.

Just kidding! But nice try getting root access. 🔒`,

  'sudo su': () => commands.sudo(),
  'sudo -i': () => commands.sudo(),
  su: () => `su: Authentication failure (you're not root here!)`,

  touch: () => `touch: cannot touch 'file': This is a read-only portfolio 📖`,
  mkdir: () => `mkdir: cannot create directory: You can look but not touch!`,

  brew: () => `
==> Formulae
leo-ashcraft ✓ (installed, great choice!)
coffee        ✓ (essential dependency)
creativity    ✓ (auto-updated daily)

Already up-to-date. ☕
`,

  apt: () => `
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  leo-ashcraft-developer (1.0.0)

Do you want to continue? [Y/n] Y

Setting up leo-ashcraft-developer... Done!
Type 'contact' to initialize.
`,

  'apt-get': () => commands.apt(),
  yum: () => commands.apt(),

  python: () => `
Python 3.11.0 (main, Oct 24 2022, 00:00:00)
>>> print("Hello from Leo's portfolio!")
Hello from Leo's portfolio!
>>> exit()

(Not a real Python shell, but I do know Python! 🐍)
`,

  node: () => `
Welcome to Node.js v20.0.0.
> console.log("Leo is awesome");
Leo is awesome
undefined
> process.exit()

(This portfolio was built with Node! 💚)
`,

  docker: () => `
CONTAINER ID   IMAGE              STATUS          NAMES
a1b2c3d4e5f6   leo/portfolio      Up 15 years     career
b2c3d4e5f6g7   leo/skills         Up 15 years     expertise
c3d4e5f6g7h8   leo/creativity     Always running  innovation

All systems operational! 🐳
`,

  'docker ps': () => commands.docker(),

  make: () => `
make: *** No targets specified and no makefile found.

Try: make coffee | make money | make sense
`,

  'make coffee': () => `☕ Brewing... Done! Coffee is ready.`,
  'make money': () => `💰 Error: Requires 'job' dependency. Type 'contact' to install.`,
  'make sense': () => `🧠 Compiling... Warning: Life rarely makes sense. Continuing anyway.`,

  weather: () => `
Current weather in Dallas-Fort Worth, TX:

  ☀️  Sunny  (probably)
  🌡️  Hot    (it's Texas)
  💨  Wind   (occasional)
  🌧️  Rain   (rare but dramatic)

Forecast: 100% chance of great code being written.
`,

  time: () => commands.date(),

  lsof: () => `
COMMAND   PID   USER   FD   TYPE   NAME
vscode    420   leo    cwd  DIR    /projects
chrome    421   leo    cwd  DIR    /stackoverflow
spotify   422   leo    cwd  DIR    /focus-music
slack     423   leo    cwd  DIR    /procrastination

(All the tools of a modern developer)
`,

  df: () => `
Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/brain     unlimited    85%   infinite  -   /knowledge
/dev/coffee        500ml   100%       0ml 100%  /energy
/dev/skills    unlimited    70%   infinite  -   /career

Warning: /dev/coffee is full. Refill recommended. ☕
`,

  free: () => `
              total        used        free      shared  buff/cache   available
Mem:       16777216     8388608     4194304     2097152     4194304     6291456
Swap:       8388608           0     8388608

Translation: Brain memory is fine, but could always use more coffee.
`,

  uname: () => `Darwin Leo-MacBook-Pro 23.0.0 Darwin Kernel Version 23.0.0 arm64`,
  'uname -a': () => commands.uname(),

  hostname: () => `leo-portfolio.local`,

  which: () => `Usage: which <command>\nTry: which leo`,
  'which leo': () => `/usr/local/bin/awesome-developer`,
  'which coffee': () => `/dev/essential`,

  alias: () => `
alias ll='ls -la'
alias please='sudo'
alias yolo='git push --force'
alias coffee='echo "☕ Here you go!"'
alias hire='contact'
`,

  please: () => commands.sudo(),

  yes: () => `y
y
y
y
(yes, Leo is hireable. Type 'contact')`,

  no: () => `no? But you haven't even seen my projects yet! Type 'projects' first.`,

  lolcat: () => `🌈 R A I N B O W   T E X T 🌈
(imagine this is colorful)`,

  figlet: () => `
 _                  _         _                   __ _
| |    ___  ___    / \\   ___| |__   ___ _ __ __ _ / _| |_
| |   / _ \\/ _ \\  / _ \\ / __| '_ \\ / __| '__/ _\` | |_| __|
| |__|  __/ (_) |/ ___ \\\\__ \\ | | | (__| | | (_| |  _| |_
|_____\\___|\\___//_/   \\_\\___/_| |_|\\___|_|  \\__,_|_|  \\__|
`,

  cmatrix: () => commands.matrix(),

  screenfetch: () => commands.neofetch(),

  clear: () => 'CLEAR',
};

export default function InteractiveTerminal() {
  const [output, setOutput] = useState<OutputLine[]>([
    { type: 'ascii', content: ASCII_ART },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (!trimmedCmd) return;

    // Add to output
    setOutput((prev) => [...prev, { type: 'input', content: `$ ${cmd}` }]);

    // Add to history
    setHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Execute command
    if (trimmedCmd === 'clear') {
      setOutput([{ type: 'ascii', content: ASCII_ART }]);
      return;
    }

    if (trimmedCmd === 'resume' || trimmedCmd === 'cv') {
      window.open(profile.resumeUrl, '_blank');
    }

    const commandFn = commands[trimmedCmd];
    if (commandFn) {
      const result = commandFn();
      setOutput((prev) => [...prev, { type: 'output', content: result }]);
    } else {
      setOutput((prev) => [
        ...prev,
        {
          type: 'error',
          content: `Command not found: ${trimmedCmd}\nType 'help' for available commands.`,
        },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const commandNames = Object.keys(commands);
      const matches = commandNames.filter((cmd) =>
        cmd.startsWith(input.toLowerCase())
      );
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setOutput((prev) => [
          ...prev,
          { type: 'output', content: `Suggestions: ${matches.join(', ')}` },
        ]);
      }
    }
  };

  return (
    <div
      className="terminal max-w-3xl mx-auto shadow-2xl"
      onClick={focusInput}
      role="application"
      aria-label="Interactive terminal"
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-dot red" aria-hidden="true" />
        <div className="terminal-dot yellow" aria-hidden="true" />
        <div className="terminal-dot green" aria-hidden="true" />
        <span className="ml-4 text-gray-400 text-sm font-mono">
          leo@portfolio ~
        </span>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="terminal-body text-sm"
        role="log"
        aria-live="polite"
      >
        {output.map((line, i) => (
          <div
            key={i}
            className={`mb-2 whitespace-pre-wrap font-mono ${
              line.type === 'input'
                ? 'text-neon-green'
                : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'ascii'
                    ? 'text-neon-cyan'
                    : 'text-gray-300'
            }`}
          >
            {line.content}
          </div>
        ))}

        {/* Input Line */}
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            placeholder="Type a command..."
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="terminal-cursor" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
