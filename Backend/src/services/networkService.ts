import os from 'os';

export interface NetworkInfo {
  ip: string;
  name: string;
  family: string;
  isInternal: boolean;
}

export class NetworkService {
  /**
   * Retrieves the preferred local LAN IPv4 address (e.g. 192.168.x.x or 10.x.x.x)
   * This address allows mobile devices on the same Wi-Fi network to scan QR codes and load receipt images.
   */
  public static getPreferredLanIp(): string {
    const interfaces = os.networkInterfaces();
    const candidates: string[] = [];

    for (const name of Object.keys(interfaces)) {
      const netList = interfaces[name];
      if (!netList) continue;

      for (const net of netList) {
        // Skip internal (127.0.0.1) and non-IPv4
        if (net.internal) continue;
        if (net.family === 'IPv4' || (net.family as any) === 4) {
          // Prioritize typical private home/office Wi-Fi ranges
          if (net.address.startsWith('192.168.') || net.address.startsWith('10.') || net.address.startsWith('172.')) {
            candidates.unshift(net.address);
          } else {
            candidates.push(net.address);
          }
        }
      }
    }

    return candidates[0] || '127.0.0.1';
  }

  /**
   * Returns all active non-internal IPv4 interfaces
   */
  public static getAllNetworkIps(): NetworkInfo[] {
    const interfaces = os.networkInterfaces();
    const result: NetworkInfo[] = [];

    for (const [name, netList] of Object.entries(interfaces)) {
      if (!netList) continue;
      for (const net of netList) {
        if (!net.internal && (net.family === 'IPv4' || (net.family as any) === 4)) {
          result.push({
            name,
            ip: net.address,
            family: 'IPv4',
            isInternal: net.internal,
          });
        }
      }
    }

    return result;
  }
}
