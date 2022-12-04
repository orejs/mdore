import type { Text } from '@codemirror/state';
import {
  CharCategory,
  combineConfig,
  EditorState,
  Facet,
  findClusterBreak,
  StateEffect,
  StateField,
} from '@codemirror/state';
import type { Command } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import { SearchCursor } from './cursor';

interface SearchConfig {
  top?: boolean;
  caseSensitive?: boolean;
  literal?: boolean;
  wholeWord?: boolean;
}
const baseFlags = 'gm' + (/x/.unicode == null ? '' : 'u');
function validRegExp(source: string) {
  try {
    new RegExp(source, baseFlags);
    return true;
  } catch {
    return false;
  }
}

class StringQuery {
  readonly spec: SearchQuery;
  constructor(spec: SearchQuery) {
    this.spec = spec;
  }

  getReplacement() {
    return this.spec.unquote(this.spec.replace);
  }

  matchAll(state: EditorState, limit: number) {
    const cursor = stringCursor(this.spec, state, 0, state.doc.length),
      ranges = [];
    while (!cursor.next().done) {
      if (ranges.length >= limit) return null;
      ranges.push(cursor.value);
    }
    return ranges;
  }
}

const searchConfigFacet: Facet<
  SearchConfig,
  Required<SearchConfig>
> = Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      top: false,
      caseSensitive: false,
      literal: false,
      wholeWord: false,
    });
  },
});
class SearchQuery {
  readonly search: string;
  readonly caseSensitive: boolean;
  readonly literal: boolean;
  readonly regexp: boolean;
  readonly replace: string;
  readonly valid: boolean;
  readonly wholeWord: boolean;

  /// @internal
  readonly unquoted: string;

  constructor(config: {
    search: string;
    caseSensitive?: boolean;
    literal?: boolean;
    regexp?: boolean;
    replace?: string;
    wholeWord?: boolean;
  }) {
    this.search = config.search;
    this.caseSensitive = !!config.caseSensitive;
    this.literal = !!config.literal;
    this.regexp = !!config.regexp;
    this.replace = config.replace || '';
    this.valid = !!this.search && (!this.regexp || validRegExp(this.search));
    this.unquoted = this.unquote(this.search);
    this.wholeWord = !!config.wholeWord;
  }

  /// @internal
  unquote(text: string) {
    return this.literal
      ? text
      : text.replace(/\\([nrt\\])/g, (_, ch) =>
          ch == 'n' ? '\n' : ch == 'r' ? '\r' : ch == 't' ? '\t' : '\\',
        );
  }

  eq(other: SearchQuery) {
    return (
      this.search == other.search &&
      this.replace == other.replace &&
      this.caseSensitive == other.caseSensitive &&
      this.regexp == other.regexp &&
      this.wholeWord == other.wholeWord
    );
  }

  /// @internal
  create(): StringQuery {
    return new StringQuery(this);
  }

  getCursor(
    state: EditorState | Text,
    from: number = 0,
    to?: number,
  ): Iterator<{ from: number; to: number }> {
    const st = (state as any).doc
      ? (state as EditorState)
      : EditorState.create({ doc: state as Text });
    if (to == null) return stringCursor(this, st, from, st.doc.length);
    return stringCursor(this, st, from, to);
  }
}

function stringCursor(
  spec: SearchQuery,
  state: EditorState,
  from: number,
  to: number,
) {
  return new SearchCursor(
    state.doc,
    spec.unquoted,
    from,
    to,
    spec.caseSensitive ? undefined : (x) => x.toLowerCase(),
    spec.wholeWord
      ? stringWordTest(
          state.doc,
          state.charCategorizer(state.selection.main.head),
        )
      : undefined,
  );
}
function stringWordTest(doc: Text, categorizer: (ch: string) => CharCategory) {
  return (from: number, to: number, _buf: string, _bufPos: number) => {
    let buf = _buf;
    let bufPos = _bufPos;
    if (bufPos > from || bufPos + buf.length < to) {
      bufPos = Math.max(0, from - 2);
      buf = doc.sliceString(bufPos, Math.min(doc.length, to + 2));
    }
    return (
      (categorizer(charBefore(buf, from - bufPos)) != CharCategory.Word ||
        categorizer(charAfter(buf, from - bufPos)) != CharCategory.Word) &&
      (categorizer(charAfter(buf, to - bufPos)) != CharCategory.Word ||
        categorizer(charBefore(buf, to - bufPos)) != CharCategory.Word)
    );
  };
}
function charBefore(str: string, index: number) {
  return str.slice(findClusterBreak(str, index, false), index);
}
function charAfter(str: string, index: number) {
  return str.slice(index, findClusterBreak(str, index));
}
function defaultQuery(state: EditorState, fallback?: SearchQuery) {
  const sel = state.selection.main;
  const selText =
    sel.empty || sel.to > sel.from + 100
      ? ''
      : state.sliceDoc(sel.from, sel.to);
  if (fallback && !selText) return fallback;
  const config = state.facet(searchConfigFacet);
  return new SearchQuery({
    search:
      fallback?.literal ?? config.literal
        ? selText
        : selText.replace(/\n/g, '\\n'),
    caseSensitive: fallback?.caseSensitive ?? config.caseSensitive,
    literal: fallback?.literal ?? config.literal,
    wholeWord: fallback?.wholeWord ?? config.wholeWord,
  });
}
export const setSearchQuery = StateEffect.define<SearchQuery>();
const togglePanel = StateEffect.define<boolean>();
class SearchState {
  readonly query: StringQuery;
  constructor(query: StringQuery) {
    this.query = query;
  }
}
const searchState: StateField<SearchState> = StateField.define<SearchState>({
  create(state) {
    return new SearchState(defaultQuery(state).create());
  },
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setSearchQuery))
        return new SearchState(effect.value.create());
      else if (effect.is(togglePanel)) return new SearchState(value.query);
    }
    return value;
  },
});

const openSearch: Command = (view) => {
  const state = view.state.field(searchState, false);
  view.dispatch({
    effects: [
      togglePanel.of(true),
      state
        ? setSearchQuery.of(defaultQuery(view.state, state.query.spec))
        : StateEffect.appendConfig.of(searchState),
    ],
  });
  return true;
};
function searchCommand(
  f: (view: EditorView, state: SearchState) => boolean,
): Command {
  return (view: EditorView) => {
    const state = view.state.field(searchState, false);
    return state && state.query.spec.valid ? f(view, state) : openSearch(view);
  };
}
function searchOpen(view: EditorView) {
  const state = view.state.field(searchState, false);
  return state && state.query.spec.valid;
}

const replaceAll = searchCommand((view, { query }) => {
  if (view.state.readOnly) return false;
  const changes = query.matchAll(view.state, 1e9)!.map((match) => {
    const { from, to } = match;
    return { from, to, insert: query.getReplacement() };
  });
  if (!changes.length) return false;
  const announceText =
    view.state.phrase('replaced $ matches', changes.length) + '.';
  view.dispatch({
    changes,
    effects: EditorView.announce.of(announceText),
    userEvent: 'input.replace.all',
  });
  return true;
});

export function initSearchAndReplace(view: EditorView) {
  if (!searchOpen(view)) {
    return openSearch(view);
  }
  return true;
}

export function searchAndReplace(
  view: EditorView,
  lastValue: string,
  newValue: string,
) {
  const query = new SearchQuery({ search: lastValue, replace: newValue });
  view.dispatch({ effects: setSearchQuery.of(query) });
  setTimeout(() => {
    replaceAll(view);
  }, 300);
}
