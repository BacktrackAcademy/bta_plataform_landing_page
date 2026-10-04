/**
 * Contenido ambiental del fondo "cyber". 100 % FICTICIO e inofensivo: nunca se ejecuta nada.
 * Hosts de laboratorio (10.x, target.local), comandos de uso común y salidas truncadas; nada que funcione como guía ofensiva.
 * Prefijos con color: `$ `/`msf6 `/`root@` = prompt (se "tipea"), `[*]` info, `[+]` ok, `[!]` aviso.
 */
export interface CyberFragment {
  lines: string[]
  /** Cabecera tipo ventana ("BURP PROXY"). */
  title?: string
  /** 1 = más cercano (nítido), 3 = más lejano (más borroso y tenue). */
  depth: 1 | 2 | 3
  /** Posición en % del bloque de sección; valores negativos = cortado por el borde. */
  pos: { top?: string, bottom?: string, left?: string, right?: string }
  /** Retraso de entrada (s), para escalonar fragmentos. */
  delay?: number
  /** Cursor parpadeante al final. */
  cursor?: boolean
  /** Más grande y algo más visible (prompt del CTA final). */
  big?: boolean
  /** Visible en móvil (por defecto no: en móvil solo se muestran los marcados). */
  mobile?: boolean
}

export type CyberVariant = 'recon' | 'scan' | 'exploit' | 'http' | 'topology' | 'prompt' | 'grid'

export const CYBER_FRAGMENTS: Record<CyberVariant, CyberFragment[]> = {
  // Especialidades: reconocimiento de red y puertos
  recon: [
    { depth: 2, pos: { top: '6%', left: '-1%' }, delay: 0.2, mobile: true, lines: ['$ nmap -sV -sC 10.10.11.24', '', 'PORT      STATE SERVICE', '22/tcp    open  ssh', '80/tcp    open  http', '443/tcp   open  https', '8080/tcp  open  http-proxy'] },
    { depth: 3, pos: { top: '52%', right: '-5%' }, delay: 1.6, lines: ['[*] Starting Nmap...', '[*] Host discovered', '[*] Enumerating services', '[*] Checking attack surface', '[+] Port 443 open', '[+] Target reachable'] },
    { depth: 1, pos: { bottom: '-2%', left: '34%' }, delay: 3.2, lines: ['$ gobuster dir -u https://target.local -w wordlist.txt', '/admin      (Status: 302)', '/login      (Status: 200)', '/api        (Status: 301)'] },
  ],
  // Cursos: terminal / Nmap
  scan: [
    { depth: 2, pos: { top: '4%', right: '-4%' }, delay: 0.2, mobile: true, lines: ['$ whoami', 'root', '', '$ sudo nmap -A target.local', 'Scanning...', '22/tcp   open', '80/tcp   open', '443/tcp  open'] },
    { depth: 3, pos: { top: '48%', left: '-4%' }, delay: 1.8, lines: ['$ curl -I https://target.local', 'HTTP/2 200', 'server: nginx', 'content-type: text/html', 'x-frame-options: DENY'] },
    { depth: 1, pos: { bottom: '-3%', right: '30%' }, delay: 3.4, lines: ['$ ssh user@10.10.14.23', 'user@10.10.14.23\'s password:', 'Last login: Tue Oct  3 21:14:07'] },
    { depth: 3, pos: { top: '22%', left: '36%' }, delay: 4.6, lines: ['$ ffuf -u https://target.local/FUZZ -w wordlist.txt', 'admin     [Status: 200, Size: 4821]', 'backup    [Status: 403, Size: 199]'] },
  ],
  // Por qué Backtrack: consola de explotación (incompleta a propósito)
  exploit: [
    { depth: 2, pos: { top: '8%', left: '-3%' }, delay: 0.3, mobile: true, lines: ['msf6 > use exploit/...', 'msf6 exploit(...) > show options', 'msf6 exploit(...) > run', '', '[*] Started reverse TCP handler', '[*] Enumerating target...'] },
    { depth: 3, pos: { bottom: '4%', right: '-4%' }, delay: 2, lines: ['[*] sqlmap resumed the following injection point(s)', '[INFO] testing connection to the target URL', '[INFO] checking if the target is protected', '[+] Session 1 opened'] },
  ],
  // Artículos: HTTP / headers / análisis de tráfico
  http: [
    { depth: 2, pos: { top: '-5%', right: '-3%' }, delay: 0.2, mobile: true, title: 'BURP PROXY', lines: ['GET /api/v1/users HTTP/1.1', 'Host: target.local', 'Authorization: Bearer ********', '', 'HTTP/1.1 200 OK', 'Content-Type: application/json'] },
    { depth: 3, pos: { top: '50%', left: '-4%' }, delay: 1.8, title: 'WIRESHARK', lines: ['No.  Source       Destination  Protocol', '12   10.0.0.5      10.0.0.1     TLSv1.3', '13   10.0.0.1      10.0.0.5     TCP', '14   10.0.0.5      10.0.0.1     HTTP/2'] },
    { depth: 1, pos: { bottom: '-3%', right: '28%' }, delay: 3.4, lines: ['$ curl -i https://target.local/login', 'Set-Cookie: session=********; HttpOnly; Secure', 'Strict-Transport-Security: max-age=31536000'] },
  ],
  // CTA final: terminal esperando comando
  prompt: [
    { depth: 1, big: true, pos: { bottom: '12%', left: '3%' }, delay: 0.4, mobile: true, cursor: true, lines: ['root@backtrack:~$ '] },
    { depth: 3, pos: { top: '10%', right: '-3%' }, delay: 1.4, lines: ['[*] Session ready', '[+] Authentication endpoint found', '[+] Welcome back, root'] },
  ],
  // Topología y solo-grid no llevan fragmentos de texto
  topology: [],
  grid: [],
}
