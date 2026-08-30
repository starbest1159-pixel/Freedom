/**
 * Tencent EdgeOne / TypeA URL Signing & HLS Stream Security Engine
 * Implements TypeA authentication, M3U8 manifest rewriting, and Go Httprouter template generation.
 */

export interface TypeAConfig {
  pk: string; // Private Key (e.g. '0123456789')
  ttl: number; // Validity period in seconds (e.g. 60)
  keyName: string; // Query param name (default: 'key')
  uid: number; // User ID (default: 0)
}

export interface TypeAVerifyResult {
  flag: boolean;
  message: string;
  statusCode: number;
  querySign?: {
    ts: string;
    rand: string;
    uid: string;
    md5hash: string;
    basePath?: string;
  };
}

export interface EdgeStreamEvent {
  id: string;
  timestamp: string;
  eventType: 'm3u8_rewrite' | 'ts_segment' | 'type_a_verify' | 'api_sync' | 'error';
  url: string;
  method: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  edgeNode: string;
  bytes: number;
  details?: string;
  signToken?: string;
}

export const DEFAULT_TYPE_A_CONFIG: TypeAConfig = {
  pk: '0123456789',
  ttl: 60,
  keyName: 'key',
  uid: 0,
};

const SUFFIX_LIST = ['.m3u8', '.ts'];

// Pure JavaScript MD5 Implementation for fast synchronous browser computation
export function md5(text: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binlMD5(x: number[], len: number) {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;

      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  function str2rstrUTF8(input: string) {
    return unescape(encodeURIComponent(input));
  }

  function rstr2binl(input: string) {
    const output: number[] = Array(input.length >> 2).fill(0);
    for (let i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    return output;
  }

  function rstr2hex(input: string) {
    const hexTab = '0123456789abcdef';
    let output = '';
    for (let i = 0; i < input.length; i++) {
      const x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output;
  }

  function binl2rstr(input: number[]) {
    let output = '';
    for (let i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
    }
    return output;
  }

  return rstr2hex(binl2rstr(binlMD5(rstr2binl(str2rstrUTF8(text)), str2rstrUTF8(text).length * 8)));
}

/**
 * Generates a signed TypeA Key token: ts-rand-uid-md5hash
 */
export function generateTypeASign(
  pathname: string,
  config: TypeAConfig = DEFAULT_TYPE_A_CONFIG,
  customTs?: number,
  customRand?: string
): { key: string; ts: number; rand: string; uid: number; md5hash: string; fullSignedUrl?: string } {
  const ts = customTs !== undefined ? customTs : Math.floor(Date.now() / 1000);
  const rand = customRand || Math.random().toString(36).substring(2, 8);
  const uid = config.uid ?? 0;

  // Format: [pathname, ts, rand, uid, PK].join('-')
  const rawString = [pathname, ts, rand, uid, config.pk].join('-');
  const md5hash = md5(rawString);

  // Key format: ts-rand-uid-md5hash
  const key = [ts, rand, uid, md5hash].join('-');

  return {
    key,
    ts,
    rand,
    uid,
    md5hash,
  };
}

/**
 * Creates a signed URL with the TypeA parameter
 */
export function signHlsUrl(
  rawUrl: string,
  config: TypeAConfig = DEFAULT_TYPE_A_CONFIG
): string {
  try {
    const urlObj = new URL(rawUrl, window.location.origin);
    const signResult = generateTypeASign(urlObj.pathname, config);
    urlObj.searchParams.set(config.keyName || 'key', signResult.key);
    return urlObj.toString();
  } catch {
    const signResult = generateTypeASign(rawUrl, config);
    return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}${config.keyName || 'key'}=${signResult.key}`;
  }
}

/**
 * Validates a TypeA URL
 */
export function checkTypeA(
  urlStr: string,
  config: TypeAConfig = DEFAULT_TYPE_A_CONFIG
): TypeAVerifyResult {
  try {
    const urlInfo = new URL(urlStr, window.location.origin);
    const sign = urlInfo.searchParams.get(config.keyName || 'key') || '';
    const elements = sign.split('-');

    if (elements.length !== 4) {
      return {
        flag: false,
        message: 'Invalid Sign Format (Expected ts-rand-uid-md5hash)',
        statusCode: 403,
      };
    }

    const [ts, rand, uid, md5hash] = elements;

    if (!ts || !rand || uid === undefined || !md5hash) {
      return {
        flag: false,
        message: 'Invalid Sign Format - Missing parameters',
        statusCode: 403,
      };
    }

    const tsNum = Number(ts);
    if (isNaN(tsNum) || !Number.isInteger(tsNum)) {
      return {
        flag: false,
        message: 'Invalid Sign Format - Timestamp is not an integer',
        statusCode: 403,
      };
    }

    // Expiration check: Date.now() > (ts + TTL) * 1000
    const nowMs = Date.now();
    const expireMs = (tsNum + config.ttl) * 1000;
    if (nowMs > expireMs) {
      return {
        flag: false,
        message: `Sign Expired (Expired at ${new Date(expireMs).toLocaleTimeString()})`,
        statusCode: 403,
      };
    }

    // Verify MD5 hash
    const expectedHash = md5([urlInfo.pathname, ts, rand, uid, config.pk].join('-'));
    if (expectedHash !== md5hash) {
      return {
        flag: false,
        message: 'Verify Sign Failed - Hash mismatch (Invalid private key or forged token)',
        statusCode: 403,
      };
    }

    const lastSlashIndex = urlInfo.pathname.lastIndexOf('/');
    const basePath = lastSlashIndex >= 0 ? urlInfo.pathname.substring(0, lastSlashIndex) : '';

    return {
      flag: true,
      message: 'TypeA Signature Verified Successfully (HTTP 200 OK)',
      statusCode: 200,
      querySign: {
        ts,
        rand,
        uid,
        md5hash,
        basePath,
      },
    };
  } catch (err: any) {
    return {
      flag: false,
      message: `Error verifying signature: ${err.message}`,
      statusCode: 500,
    };
  }
}

/**
 * Rewrites an M3U8 Manifest according to Tencent EdgeOne rules:
 * - Rewrites #EXT-X-MAP URI with ?key=...
 * - Rewrites each .ts line with ?key=...
 */
export function rewriteM3u8Manifest(
  manifestContent: string,
  basePath: string,
  config: TypeAConfig = DEFAULT_TYPE_A_CONFIG,
  querySign?: { ts: string; rand: string; uid: string }
): string {
  const ts = querySign?.ts ? Number(querySign.ts) : Math.floor(Date.now() / 1000);
  const rand = querySign?.rand || Math.random().toString(36).substring(2, 8);
  const uid = querySign?.uid !== undefined ? Number(querySign.uid) : (config.uid ?? 0);

  const lines = manifestContent.split('\n');
  const rewrittenLines = lines.map((line) => {
    // Skip empty lines
    if (/^\s*$/.test(line)) {
      return line;
    }

    // Process Tags
    if (line.charAt(0) === '#') {
      // Process #EXT-X-MAP
      if (line.startsWith('#EXT-X-MAP')) {
        return line.replace(/URI="([^"]+)"/, (matched, p1) => {
          if (!p1) return matched;
          const chunkPath = `${basePath}/${p1}`.replace(/\/+/g, '/');
          const chunkSign = generateTypeASign(chunkPath, config, ts, rand);
          return `URI="${p1}?${config.keyName || 'key'}=${chunkSign.key}"`;
        });
      }
      return line;
    }

    // Process TS and Media Segment URIs
    const cleanSegment = line.trim();
    const segmentPath = cleanSegment.startsWith('http')
      ? new URL(cleanSegment).pathname
      : `${basePath}/${cleanSegment}`.replace(/\/+/g, '/');

    const segmentSign = generateTypeASign(segmentPath, config, ts, rand);
    const delimiter = cleanSegment.includes('?') ? '&' : '?';
    return `${cleanSegment}${delimiter}${config.keyName || 'key'}=${segmentSign.key}`;
  });

  return rewrittenLines.join('\n');
}

/**
 * Sample M3U8 Manifest for demonstration and live testing
 */
export const SAMPLE_M3U8_MANIFEST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-MAP:URI="init.mp4"
#EXTINF:9.009,
segment_000.ts
#EXTINF:8.976,
segment_001.ts
#EXTINF:9.042,
segment_002.ts
#EXTINF:9.009,
segment_003.ts
#EXTINF:8.942,
segment_004.ts
#EXT-X-ENDLIST`;

/**
 * Returns the Go Httprouter Template for Tencent EdgeOne
 */
export function getGoHttprouterTemplate(config: TypeAConfig = DEFAULT_TYPE_A_CONFIG): string {
  return `// TencentEdgeOne/go-httprouter-template
// TypeA Authentication CDN Middleware for HLS Streams (.m3u8 & .ts)

package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
)

const (
	PK       = "${config.pk}"  // Private Key for TypeA authentication
	TTL      = ${config.ttl}           // Validity period in seconds
	KeyName  = "${config.keyName}"      // Query key name
	UID      = ${config.uid}            // Default UID
)

func main() {
	router := httprouter.New()

	// Intercept all HLS stream requests (*filepath)
	router.GET("/*filepath", HandleEdgeOneHLS)

	fmt.Println("Tencent EdgeOne HLS Go HttpRouter is running on :8080")
	http.ListenAndServe(":8080", router)
}

func HandleEdgeOneHLS(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	path := r.URL.Path

	// Check whether file extension is .m3u8 or .ts
	if !strings.HasSuffix(path, ".m3u8") && !strings.HasSuffix(path, ".ts") {
		http.DefaultServeMux.ServeHTTP(w, r)
		return
	}

	// 1. TypeA Authentication Check
	querySign := r.URL.Query().Get(KeyName)
	valid, ts, rand, uid, err := VerifyTypeA(path, querySign)
	if !valid {
		w.Header().Set("X-Auth-Err", err)
		http.Error(w, fmt.Sprintf("403 Forbidden: %s", err), http.StatusForbidden)
		return
	}

	// 2. Rewrite M3U8 Manifest
	if strings.HasSuffix(path, ".m3u8") {
		RewriteAndServeM3u8(w, r, path, ts, rand, uid)
		return
	}

	// 3. Serve TS Segment Resource
	ServeTsSegment(w, r)
}

func VerifyTypeA(path, sign string) (bool, int64, string, int, string) {
	if sign == "" {
		return false, 0, "", 0, "Missing Sign Parameter"
	}
	parts := strings.Split(sign, "-")
	if len(parts) != 4 {
		return false, 0, "", 0, "Invalid Sign Format"
	}

	ts, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		return false, 0, "", 0, "Invalid Timestamp"
	}
	rand := parts[1]
	uid, _ := strconv.Atoi(parts[2])
	md5hash := parts[3]

	// Expiry Check
	if time.Now().Unix() > ts+TTL {
		return false, 0, "", 0, "Sign Expired"
	}

	// Calculate MD5 Hash: md5(path-ts-rand-uid-PK)
	raw := fmt.Sprintf("%s-%d-%s-%d-%s", path, ts, rand, uid, PK)
	hasher := md5.New()
	hasher.Write([]byte(raw))
	expectedHash := hex.EncodeToString(hasher.Sum(nil))

	if expectedHash != md5hash {
		return false, 0, "", 0, "Verify Sign Failed"
	}

	return true, ts, rand, uid, ""
}

func RewriteAndServeM3u8(w http.ResponseWriter, r *http.Request, path string, ts int64, rand string, uid int) {
	// Fetch from Origin
	resp, err := http.Get("https://origin.yourcdn.com" + path)
	if err != nil || resp.StatusCode != 200 {
		http.Error(w, "504 Invalid Origin", http.StatusGatewayTimeout)
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	lines := strings.Split(string(bodyBytes), "\\n")
	basePath := path[:strings.LastIndex(path, "/")]

	var rewrittenLines []string
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			rewrittenLines = append(rewrittenLines, line)
			continue
		}
		if strings.HasPrefix(trimmed, "#") {
			rewrittenLines = append(rewrittenLines, line)
			continue
		}
		// Sign TS Segment
		tsPath := fmt.Sprintf("%s/%s", basePath, trimmed)
		raw := fmt.Sprintf("%s-%d-%s-%d-%s", tsPath, ts, rand, uid, PK)
		hasher := md5.New()
		hasher.Write([]byte(raw))
		h := hex.EncodeToString(hasher.Sum(nil))
		key := fmt.Sprintf("%d-%s-%d-%s", ts, rand, uid, h)
		rewrittenLines = append(rewrittenLines, fmt.Sprintf("%s?%s=%s", line, KeyName, key))
	}

	w.Header().Set("Content-Type", "application/vnd.apple.mpegurl")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(strings.Join(rewrittenLines, "\\n")))
}

func ServeTsSegment(w http.ResponseWriter, r *http.Request) {
	// Proxy to TS chunk origin
	resp, err := http.Get("https://origin.yourcdn.com" + r.URL.Path)
	if err != nil || resp.StatusCode != 200 {
		http.Error(w, "504 Invalid Origin", http.StatusGatewayTimeout)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "video/mp2t")
	w.WriteHeader(http.StatusOK)
	io.Copy(w, resp.Body)
}
`;
}

/**
 * Returns Tencent EdgeOne JavaScript Edge Function Template
 */
export function getEdgeOneJsWorkerTemplate(config: TypeAConfig = DEFAULT_TYPE_A_CONFIG): string {
  return `// Tencent EdgeOne Edge Function / Cloudflare Worker
// TypeA HLS Authentication Rule

const PK = '${config.pk}';
const TTL = ${config.ttl};
const KEY_NAME = '${config.keyName}';
const UID = ${config.uid};
const SUFFIX_LIST = ['.m3u8', '.ts'];

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    const { request } = event;
    const urlInfo = new URL(request.url);
    const suffix = getSuffix(urlInfo.pathname);

    // Check whether the file extension is .m3u8 or .ts
    if (!SUFFIX_LIST.includes(suffix)) {
      return fetch(request);
    }

    // TypeA authentication check
    const checkResult = await checkTypeA(urlInfo);
    if (!checkResult.flag) {
      return new Response(checkResult.message, {
        status: 403,
        headers: { 'X-Auth-Err': checkResult.message },
      });
    }

    // Rewrite the .m3u8 file and respond
    if (suffix === '.m3u8') {
      return fetchM3u8({
        request,
        querySign: {
          basePath: urlInfo.pathname.substring(0, urlInfo.pathname.lastIndexOf('/')),
          ...checkResult.querySign,
        },
      });
    }

    // Respond with .ts resources
    if (suffix === '.ts') {
      return fetchTs(request);
    }
  } catch (error) {
    return new Response(error.stack, { status: 544 });
  }
  return fetch(request);
}

async function checkTypeA(urlInfo) {
  const sign = urlInfo.searchParams.get(KEY_NAME) || '';
  const elements = sign.split('-');
  if (elements.length !== 4) {
    return { flag: false, message: 'Invalid Sign Format' };
  }
  const [ts, rand, uid, md5hash] = elements;
  if (!ts || !rand || !uid || !md5hash) {
    return { flag: false, message: 'Invalid Sign Format' };
  }
  if (!Number.isInteger(Number(ts))) {
    return { flag: false, message: 'Sign Expired' };
  }
  if (Date.now() > (Number(ts) + TTL) * 1000) {
    return { flag: false, message: 'Sign Expired' };
  }
  const hash = await md5([urlInfo.pathname, ts, rand, uid, PK].join('-'));
  if (hash !== md5hash) {
    return { flag: false, message: 'Verify Sign Failed' };
  }
  return {
    flag: true,
    message: 'success',
    querySign: { rand, uid, md5hash, ts },
  };
}

async function fetchM3u8({ request, querySign }) {
  request.headers.delete('Accept-Encoding');
  let response = null;
  try {
    response = await fetch(request);
    if (response.status !== 200) return response;
  } catch (error) {
    return new Response('', { status: 504, headers: { 'X-Fetch-Err': 'Invalid Origin' } });
  }
  const content = await response.text();
  const lines = content.split('\\n');
  const contentArr = await Promise.all(
    lines.map((line) => rewriteLine({ line, querySign }))
  );
  return new Response(contentArr.join('\\n'), response);
}

async function fetchTs(request) {
  let response = null;
  try {
    response = await fetch(request);
    if (response.status !== 200) return response;
  } catch (error) {
    return new Response('', { status: 504, headers: { 'X-Fetch-Err': 'Invalid Origin' } });
  }
  return response;
}

async function rewriteLine({ line, querySign }) {
  if (/^\\s*$/.test(line)) return line;
  if (line.charAt(0) === '#') {
    if (line.startsWith('#EXT-X-MAP')) {
      const key = await createSign(querySign, line);
      line = line.replace(/URI="([^"]+)"/, (matched, p1) => {
        return p1 ? matched.replace(p1, \`\${p1}?key=\${key}\`) : matched;
      });
    }
    return line;
  }
  const key = await createSign(querySign, line);
  return \`\${line}?\${KEY_NAME}=\${key}\`;
}

async function createSign(querySign, line) {
  const { ts, rand, uid = 0 } = querySign;
  const pathname = \`\${querySign.basePath}/\${line}\`;
  const md5hash = await md5([pathname, ts, rand, uid, PK].join('-'));
  return [ts, rand, uid, md5hash].join('-');
}

function getSuffix(pathname) {
  const suffix = pathname.match(/\\.m3u8|\\.ts$/);
  return suffix ? suffix[0] : null;
}

async function md5(text) {
  const buffer = await crypto.subtle.digest('MD5', new TextEncoder().encode(text));
  return Array.prototype.map.call(new Uint8Array(buffer), (x) => (x >= 16 ? x.toString(16) : '0' + x.toString(16))).join('');
}
`;
}
