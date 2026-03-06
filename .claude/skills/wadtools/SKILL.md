---
name: wadtools
description: Analyze League of Legends WAD file structure using the wadtools CLI. Use when exploring WAD contents, understanding champion/skin file layouts, resolving asset paths, or gathering context for backend features that interact with WAD archives.
user-invocable: false
---

# wadtools - WAD File Analysis

Use the `wadtools` CLI to explore League of Legends `.wad` archive file structure. This is essential context when building backend features that read, write, or transform WAD contents.

## When to use wadtools

- Understanding what files exist inside a WAD (textures, bin configs, meshes, animations, etc.)
- Resolving asset paths and naming conventions for champions, skins, maps
- Comparing WAD versions to identify changes between patches
- Gathering structural context before implementing features that manipulate WAD data

## Key commands

### List WAD contents (non-destructive, preferred for exploration)

```bash
# List all files in a WAD as a table
wadtools ls -i <path-to-wad> -H <hashtable>

# List as JSON for parsing
wadtools ls -i <path-to-wad> -H <hashtable> -F json

# List as flat paths (good for piping/grep)
wadtools ls -i <path-to-wad> -H <hashtable> -F flat

# List only specific file types
wadtools ls -i <path-to-wad> -H <hashtable> -f bin dds png

# Search for files matching a pattern
wadtools ls -i <path-to-wad> -H <hashtable> -x "data/.*\.bin$"

# List from multiple WADs
wadtools ls -i one.wad.client -i two.wad.client -H <hashtable>
```

### Extract files (when you need actual file contents)

```bash
# Extract everything
wadtools extract -i <path-to-wad> -o <output-dir> -H <hashtable>

# Extract only bin config files
wadtools extract -i <path-to-wad> -o <output-dir> -H <hashtable> -f bin

# Extract files matching a regex
wadtools extract -i <path-to-wad> -o <output-dir> -H <hashtable> -x "^assets/characters/aatrox/"

# Extract everything EXCEPT certain types (inverted filter)
wadtools extract -i <path-to-wad> -o <output-dir> -H <hashtable> -f dds tex -v
```

### Diff two WADs

```bash
wadtools diff -r <old.wad> -t <new.wad> -H <hashtable> -o diff.csv
```

### Find hashtable directory

```bash
wadtools hashtable-dir
# alias: wadtools hd
```

## Important details

### Hashtable resolution

- Without a hashtable (`-H`), paths appear as 16-char hex hashes
- Hashtables are loaded from: `--hashtable-dir` flag > `hashtable_dir` in `wadtools.toml` > default directory (`Documents/LeagueToolkit/wad_hashtables` on Windows)
- Always use a hashtable when exploring to get readable paths

### Filtering

- `-f` (file type) and `-x` (regex pattern) combine with AND semantics
- `-v` inverts both filters (excludes matches instead of including)
- Regex is case-insensitive by default; prefix with `(?-i)` to opt out

### Output formats for `ls`

- `table` (default): colored table with sizes, compression ratio, types
- `json`: structured JSON with full metadata - best for programmatic analysis
- `csv`: spreadsheet-friendly
- `flat`: plain path list, one per line - best for piping

### File naming quirks

- `.ltk` postfix is appended when original path has no extension or would collide with a directory
- If real type is detectable, it's appended after `.ltk` (e.g. `foo.ltk.png`)
- Long filenames fall back to chunk hash (16 hex chars)

## Typical WAD file structure (champions)

WAD files for champions typically contain:

- `data/characters/<name>/` - bin config files (character data, abilities)
- `assets/characters/<name>/skins/` - skin-specific assets (textures, meshes)
- `assets/characters/<name>/animations/` - animation files
- `assets/characters/<name>/hud/` - HUD icons and portraits

## Usage pattern for context gathering

When you need to understand WAD structure for a feature:

1. **List contents** with `wadtools ls -F json` to get structured overview
2. **Filter by type** with `-f bin` to find config files, `-f dds png` for textures
3. **Search with regex** using `-x` to find specific asset patterns
4. **Extract samples** if you need to inspect actual file contents
5. **Diff versions** if you need to understand what changed between patches
