export const trainingCategories = [
  { slug: "pwn", label: "Binary exploitation" },
  { slug: "web", label: "Web security" },
  { slug: "reverse-engineering", label: "Reverse engineering" },
  { slug: "cryptography", label: "Cryptography" },
  { slug: "forensics", label: "Forensics" },
] as const

export type TrainingCategorySlug = (typeof trainingCategories)[number]["slug"]

export function getTrainingCategory(slug: string) {
  return trainingCategories.find((c) => c.slug === slug)
}

export interface TrainingLink {
  name: string
  url: string
  description?: string
}

export const trainingTools: Record<string, TrainingLink[]> = {
  pwn: [
    { name: "pwntools", url: "https://docs.pwntools.com/", description: "CTF exploitation framework for Python." },
    { name: "GDB", url: "https://www.sourceware.org/gdb/", description: "The GNU debugger." },
    { name: "pwndbg", url: "https://github.com/pwndbg/pwndbg", description: "Exploit-focused GDB plugin." },
    { name: "GEF", url: "https://github.com/hugsy/gef", description: "GDB enhanced features for exploitation." },
    { name: "Ghidra", url: "https://ghidra-sre.org/", description: "Open-source disassembler and decompiler." },
    { name: "ROPgadget", url: "https://github.com/JonathanSalwan/ROPgadget", description: "Find ROP gadgets in binaries." },
    { name: "Ropper", url: "https://github.com/sashs/Ropper", description: "Gadget finder and ROP chain builder." },
    { name: "one_gadget", url: "https://github.com/david942j/one_gadget", description: "Find single-shot libc execve gadgets." },
    { name: "libc-database", url: "https://github.com/niklasb/libc-database", description: "Identify libc versions from leaks." },
    { name: "checksec", url: "https://github.com/slimm609/checksec.sh", description: "Show binary protections." },
    { name: "patchelf", url: "https://github.com/NixOS/patchelf", description: "Set interpreter and rpath on ELF files." },
    { name: "angr", url: "https://angr.io/", description: "Binary analysis and symbolic execution." },
  ],
  web: [
    { name: "Burp Suite", url: "https://portswigger.net/burp", description: "Web proxy and testing toolkit." },
    { name: "OWASP ZAP", url: "https://www.zaproxy.org/", description: "Open-source web app scanner and proxy." },
    { name: "sqlmap", url: "https://sqlmap.org/", description: "Automatic SQL injection tool." },
    { name: "ffuf", url: "https://github.com/ffuf/ffuf", description: "Fast web fuzzer." },
    { name: "gobuster", url: "https://github.com/OJ/gobuster", description: "Directory and DNS brute forcer." },
    { name: "feroxbuster", url: "https://github.com/epi052/feroxbuster", description: "Recursive content discovery." },
    { name: "nuclei", url: "https://github.com/projectdiscovery/nuclei", description: "Template-based vulnerability scanner." },
    { name: "wpscan", url: "https://wpscan.com/", description: "WordPress security scanner." },
    { name: "jwt_tool", url: "https://github.com/ticarpi/jwt_tool", description: "Test and tamper with JSON Web Tokens." },
    { name: "httpie", url: "https://httpie.io/", description: "Human-friendly HTTP client." },
  ],
  "reverse-engineering": [
    { name: "Ghidra", url: "https://ghidra-sre.org/", description: "Open-source disassembler and decompiler." },
    { name: "IDA Free", url: "https://hex-rays.com/ida-free/", description: "Interactive disassembler." },
    { name: "Binary Ninja", url: "https://binary.ninja/", description: "Reverse-engineering platform." },
    { name: "Cutter", url: "https://cutter.re/", description: "GUI for the rizin framework." },
    { name: "radare2", url: "https://rada.re/n/", description: "Command-line reversing framework." },
    { name: "x64dbg", url: "https://x64dbg.com/", description: "Windows user-mode debugger." },
    { name: "dnSpy", url: "https://github.com/dnSpy/dnSpy", description: "Debug and edit .NET assemblies." },
    { name: "jadx", url: "https://github.com/skylot/jadx", description: "Dex to Java decompiler." },
    { name: "apktool", url: "https://apktool.org/", description: "Decode and rebuild Android APKs." },
    { name: "Frida", url: "https://frida.re/", description: "Dynamic instrumentation toolkit." },
    { name: "angr", url: "https://angr.io/", description: "Binary analysis and symbolic execution." },
  ],
  cryptography: [
    { name: "SageMath", url: "https://www.sagemath.org/", description: "Mathematics system for number theory and algebra." },
    { name: "CyberChef", url: "https://gchq.github.io/CyberChef/", description: "Encoding and data transformation workbench." },
    { name: "pycryptodome", url: "https://pycryptodome.readthedocs.io/", description: "Python cryptography library." },
    { name: "RsaCtfTool", url: "https://github.com/RsaCtfTool/RsaCtfTool", description: "Automated RSA attacks." },
    { name: "dcode.fr", url: "https://www.dcode.fr/", description: "Cipher and encoding identifier and solver." },
    { name: "SymPy", url: "https://www.sympy.org/", description: "Python symbolic mathematics." },
    { name: "FactorDB", url: "https://factordb.com/", description: "Database of integer factorisations." },
    { name: "hashcat", url: "https://hashcat.net/hashcat/", description: "GPU password and hash recovery." },
    { name: "John the Ripper", url: "https://www.openwall.com/john/", description: "Password cracker." },
    { name: "Z3", url: "https://github.com/Z3Prover/z3", description: "SMT constraint solver." },
  ],
  forensics: [
    { name: "Wireshark", url: "https://www.wireshark.org/", description: "Network protocol analyser." },
    { name: "Volatility", url: "https://volatilityfoundation.org/", description: "Memory forensics framework." },
    { name: "Autopsy", url: "https://www.autopsy.com/", description: "Digital forensics GUI over Sleuth Kit." },
    { name: "The Sleuth Kit", url: "https://www.sleuthkit.org/", description: "Disk and filesystem forensics tools." },
    { name: "binwalk", url: "https://github.com/ReFirmLabs/binwalk", description: "Firmware and embedded file carving." },
    { name: "foremost", url: "https://foremost.sourceforge.net/", description: "File carving by header and footer." },
    { name: "ExifTool", url: "https://exiftool.org/", description: "Read and write file metadata." },
    { name: "steghide", url: "https://steghide.sourceforge.net/", description: "Hide and extract data in media." },
    { name: "zsteg", url: "https://github.com/zed-0xff/zsteg", description: "Detect LSB steganography in PNG and BMP." },
    { name: "Stegsolve", url: "https://github.com/Giotino/stegsolve", description: "Inspect image bit planes." },
    { name: "Audacity", url: "https://www.audacityteam.org/", description: "Audio editor and spectrogram viewer." },
    { name: "NetworkMiner", url: "https://www.netresec.com/?page=NetworkMiner", description: "Extract artefacts from PCAPs." },
  ],
}

export const trainingResources: Record<string, TrainingLink[]> = {
  pwn: [
    { name: "pwn.college", url: "https://pwn.college/", description: "Structured hands-on exploitation course." },
    { name: "Nightmare", url: "https://guyinatuxedo.github.io/", description: "Intro to binary exploitation via CTF." },
    { name: "how2heap", url: "https://github.com/shellphish/how2heap", description: "Educational heap exploitation techniques." },
    { name: "ir0nstone notes", url: "https://ir0nstone.gitbook.io/notes", description: "Binary exploitation notes." },
    { name: "CTF101: Pwn", url: "https://ctf101.org/binary-exploitation/overview/", description: "Binary exploitation basics." },
    { name: "LiveOverflow", url: "https://www.youtube.com/@LiveOverflow", description: "Binary exploitation video series." },
  ],
  web: [
    { name: "Web Security Academy", url: "https://portswigger.net/web-security", description: "Free labs from PortSwigger." },
    { name: "OWASP Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/", description: "Methodology for web testing." },
    { name: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", description: "Most critical web risks." },
    { name: "PayloadsAllTheThings", url: "https://github.com/swisskyrepo/PayloadsAllTheThings", description: "Payloads and bypasses by category." },
    { name: "HackTricks", url: "https://book.hacktricks.xyz/", description: "Practical pentesting reference." },
    { name: "CTF101: Web", url: "https://ctf101.org/web-exploitation/overview/", description: "Web exploitation basics." },
  ],
  "reverse-engineering": [
    { name: "Reverse Engineering for Beginners", url: "https://beginners.re/", description: "Free comprehensive RE book." },
    { name: "crackmes.one", url: "https://crackmes.one/", description: "Practice crackmes by difficulty." },
    { name: "Malware Unicorn RE101", url: "https://malwareunicorn.org/workshops/re101.html", description: "Reverse engineering workshop." },
    { name: "CTF101: RE", url: "https://ctf101.org/reverse-engineering/overview/", description: "Reverse engineering basics." },
    { name: "Azeria ARM Labs", url: "https://azeria-labs.com/", description: "ARM assembly and exploitation." },
    { name: "Nightmare", url: "https://guyinatuxedo.github.io/", description: "RE and pwn through CTF." },
  ],
  cryptography: [
    { name: "CryptoHack", url: "https://cryptohack.org/", description: "Interactive modern cryptography challenges." },
    { name: "Cryptopals", url: "https://cryptopals.com/", description: "Hands-on crypto attack exercises." },
    { name: "Applied Cryptography (book)", url: "https://toc.cryptobook.us/", description: "Boneh and Shoup graduate text." },
    { name: "Dan Boneh: Crypto I", url: "https://www.coursera.org/learn/crypto", description: "University cryptography course." },
    { name: "CTF101: Crypto", url: "https://ctf101.org/cryptography/overview/", description: "Cryptography basics." },
    { name: "A11In CTF Crypto notes", url: "https://github.com/ashutosh1206/Crypton", description: "Library of crypto attacks." },
  ],
  forensics: [
    { name: "CTF101: Forensics", url: "https://ctf101.org/forensics/overview/", description: "Forensics basics." },
    { name: "Aperi'Solve", url: "https://www.aperisolve.com/", description: "Online layered image stego analysis." },
    { name: "HackTricks: Forensics", url: "https://book.hacktricks.xyz/forensics/basic-forensic-methodology", description: "Forensic methodology reference." },
    { name: "Volatility docs", url: "https://volatility3.readthedocs.io/", description: "Memory forensics documentation." },
    { name: "Wireshark User Guide", url: "https://www.wireshark.org/docs/wsug_html_chunked/", description: "Official packet analysis guide." },
    { name: "DFIR Report", url: "https://thedfirreport.com/", description: "Real-world intrusion analyses." },
  ],
}
