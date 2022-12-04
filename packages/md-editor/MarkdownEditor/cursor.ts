import type { Text, TextIterator } from '@codemirror/state';
import { codePointAt, codePointSize, fromCodePoint } from '@codemirror/state';

const basicNormalize: (string: string) => string =
  typeof String.prototype.normalize == 'function'
    ? (x) => x.normalize('NFKD')
    : (x) => x;

export class SearchCursor implements Iterator<{ from: number; to: number }> {
  private iter: TextIterator;
  value = { from: 0, to: 0 };
  done = false;
  private matches: number[] = [];
  private buffer = '';
  private bufferPos = 0;
  private bufferStart: number;
  private normalize: (string: string) => string;
  private test?: (
    from: number,
    to: number,
    buffer: string,
    bufferPos: number,
  ) => boolean;
  private query: string;

  constructor(
    text: Text,
    query: string,
    from: number = 0,
    to: number = text.length,
    normalize?: (string: string) => string,
    test?: (
      from: number,
      to: number,
      buffer: string,
      bufferPos: number,
    ) => boolean,
  ) {
    this.iter = text.iterRange(from, to);
    this.bufferStart = from;
    this.normalize = normalize
      ? (x) => normalize(basicNormalize(x))
      : basicNormalize;
    this.query = this.normalize(query);
    this.test = test;
  }

  private peek() {
    if (this.bufferPos == this.buffer.length) {
      this.bufferStart += this.buffer.length;
      this.iter.next();
      if (this.iter.done) return -1;
      this.bufferPos = 0;
      this.buffer = this.iter.value;
    }
    return codePointAt(this.buffer, this.bufferPos);
  }

  next() {
    while (this.matches.length) this.matches.pop();
    return this.nextOverlapping();
  }

  nextOverlapping() {
    for (;;) {
      const next = this.peek();
      if (next < 0) {
        this.done = true;
        return this;
      }
      const str = fromCodePoint(next),
        start = this.bufferStart + this.bufferPos;
      this.bufferPos += codePointSize(next);
      const norm = this.normalize(str);
      for (let i = 0, pos = start; ; i++) {
        const code = norm.charCodeAt(i);
        const match = this.match(code, pos);
        if (match) {
          this.value = match;
          return this;
        }
        if (i == norm.length - 1) break;
        if (pos == start && i < str.length && str.charCodeAt(i) == code) pos++;
      }
    }
  }

  private match(code: number, pos: number) {
    let match: null | { from: number; to: number } = null;
    for (let i = 0; i < this.matches.length; i += 2) {
      const index = this.matches[i];
      let keep = false;
      if (this.query.charCodeAt(index) == code) {
        if (index == this.query.length - 1) {
          match = { from: this.matches[i + 1], to: pos + 1 };
        } else {
          this.matches[i]++;
          keep = true;
        }
      }
      if (!keep) {
        this.matches.splice(i, 2);
        i -= 2;
      }
    }
    if (this.query.charCodeAt(0) == code) {
      if (this.query.length == 1) match = { from: pos, to: pos + 1 };
      else this.matches.push(1, pos);
    }
    if (
      match &&
      this.test &&
      !this.test(match.from, match.to, this.buffer, this.bufferPos)
    )
      match = null;
    return match;
  }

  [Symbol.iterator]!: () => Iterator<{ from: number; to: number }>;
}

if (typeof Symbol != 'undefined')
  SearchCursor.prototype[Symbol.iterator] = function (this: SearchCursor) {
    return this;
  };
