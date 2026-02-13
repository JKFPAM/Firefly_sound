import {
  CSSProperties,
  DragEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

const ROWS = 5;
const COLUMNS = 8;

const DESIGNS = [
  "dome",
  "double-dome",
  "curve",
  "quarter",
  "diagonal",
  "dot",
  "diamond",
  "pill",
  "notch",
  "arc"
] as const;

const ANIMATIONS = [
  "pop",
  "wobble",
  "swing",
  "bounce",
  "slide",
  "jump",
  "spin",
  "pulse",
  "tilt",
  "ripple"
] as const;

type DesignType = (typeof DESIGNS)[number];
type AnimationType = (typeof ANIMATIONS)[number];

type ManifestSound = {
  id: string;
  label: string;
  file: string;
  relativePath: string;
  url: string;
  category: string;
};

type ManifestPayload = {
  sounds?: ManifestSound[];
};

type SoundProfile = ManifestSound & {
  design: DesignType;
  animation: AnimationType;
  hue: number;
  rotate: number;
  scale: number;
};

type GridState = (string | null)[][];

type CellEditorState = {
  row: number;
  column: number;
  category: string;
  soundId: string;
};

type AddMode = "menu" | "random";

function cellKey(row: number, column: number): string {
  return `${row}-${column}`;
}

function createEmptyGrid(): GridState {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLUMNS }, () => null));
}

function createTemplateGrid(profiles: SoundProfile[]): GridState {
  const next = createEmptyGrid();

  for (let row = 0; row < ROWS; row += 1) {
    const profile = profiles[row];
    if (!profile) {
      continue;
    }
    next[row][0] = profile.id;
  }

  return next;
}

function buildProfiles(sounds: ManifestSound[]): SoundProfile[] {
  return sounds.map((sound, index) => ({
    ...sound,
    design: DESIGNS[index % DESIGNS.length],
    animation: ANIMATIONS[(index * 3) % ANIMATIONS.length],
    hue: (index * 13) % 360,
    rotate: (index % 4) * 90,
    scale: 1 + (index % 3) * 0.05
  }));
}

function shapeStyle(profile: SoundProfile): CSSProperties {
  return {
    transform: `rotate(${profile.rotate}deg) scale(${profile.scale})`,
    filter: `hue-rotate(${profile.hue}deg)`
  };
}

export default function App() {
  const [profiles, setProfiles] = useState<SoundProfile[]>([]);
  const [grid, setGrid] = useState<GridState>(() => createEmptyGrid());
  const [editor, setEditor] = useState<CellEditorState | null>(null);
  const [isProfilesLoading, setIsProfilesLoading] = useState<boolean>(true);
  const [addMode, setAddMode] = useState<AddMode>("menu");
  const [randomCategory, setRandomCategory] = useState<string>("all");
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadColumn, setPlayheadColumn] = useState<number>(-1);
  const [bpm, setBpm] = useState<number>(108);
  const [status, setStatus] = useState<string>(
    "Click any square to open category and sound menus."
  );
  const [playingCells, setPlayingCells] = useState<Record<string, true>>({});

  const profileById = useMemo(
    () => new Map(profiles.map((profile) => [profile.id, profile])),
    [profiles]
  );

  const categories = useMemo(
    () => Array.from(new Set(profiles.map((profile) => profile.category))),
    [profiles]
  );
  const orderedCategories = useMemo(() => [...categories].sort(), [categories]);

  const profilesByCategory = useMemo(() => {
    const map = new Map<string, SoundProfile[]>();

    for (const profile of profiles) {
      const bucket = map.get(profile.category);
      if (bucket) {
        bucket.push(profile);
      } else {
        map.set(profile.category, [profile]);
      }
    }

    return map;
  }, [profiles]);

  useEffect(() => {
    if (randomCategory !== "all" && !categories.includes(randomCategory)) {
      setRandomCategory("all");
    }
  }, [categories, randomCategory]);

  const gridRef = useRef<GridState>(grid);
  const bpmRef = useRef<number>(bpm);
  const schedulerRef = useRef<number | null>(null);
  const nextStepTimeRef = useRef<number>(0);
  const stepRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    let cancelled = false;

    const loadManifest = async (): Promise<void> => {
      try {
        const response = await fetch("/sounds-manifest.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not load sounds-manifest.json");
        }

        const payload = (await response.json()) as ManifestPayload;
        const manifestSounds = Array.isArray(payload.sounds) ? payload.sounds : [];
        if (manifestSounds.length === 0) {
          throw new Error("No sounds found in manifest.");
        }

        const nextProfiles = buildProfiles(manifestSounds);

        if (cancelled) {
          return;
        }

        setProfiles(nextProfiles);
        setGrid(createTemplateGrid(nextProfiles));
        setStatus(`Loaded ${nextProfiles.length} sounds in ${new Set(nextProfiles.map((entry) => entry.category)).size} categories.`);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus(
          error instanceof Error
            ? `Sound setup error: ${error.message}`
            : "Sound setup error."
        );
      } finally {
        if (!cancelled) {
          setIsProfilesLoading(false);
        }
      }
    };

    void loadManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (schedulerRef.current !== null) {
        window.clearInterval(schedulerRef.current);
      }
      for (const timerId of timersRef.current) {
        window.clearTimeout(timerId);
      }
      const context = audioContextRef.current;
      if (context) {
        void context.close();
      }
    },
    []
  );

  const ensureAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      const context = new window.AudioContext();
      const gain = context.createGain();
      gain.gain.value = 0.9;
      gain.connect(context.destination);

      audioContextRef.current = context;
      masterGainRef.current = gain;
    }

    return audioContextRef.current;
  };

  const loadBufferBySoundId = async (soundId: string): Promise<AudioBuffer> => {
    const profile = profileById.get(soundId);
    if (!profile) {
      throw new Error(`Unknown sound id: ${soundId}`);
    }

    const cached = buffersRef.current.get(profile.url);
    if (cached) {
      return cached;
    }

    const context = ensureAudioContext();
    const response = await fetch(profile.url);
    if (!response.ok) {
      throw new Error(`Could not load ${profile.relativePath}`);
    }

    const encoded = await response.arrayBuffer();
    const decoded = await context.decodeAudioData(encoded.slice(0));
    buffersRef.current.set(profile.url, decoded);
    return decoded;
  };

  const preloadUsedSounds = async (): Promise<void> => {
    const used = new Set<string>();

    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const soundId = gridRef.current[row][column];
        if (soundId) {
          used.add(soundId);
        }
      }
    }

    await Promise.all(Array.from(used, (soundId) => loadBufferBySoundId(soundId)));
  };

  const flashCell = (row: number, column: number, when: number): void => {
    const context = audioContextRef.current;
    if (!context) {
      return;
    }

    const key = cellKey(row, column);
    const delay = Math.max(0, (when - context.currentTime) * 1000);

    const startTimer = window.setTimeout(() => {
      setPlayingCells((previous) => ({
        ...previous,
        [key]: true
      }));
    }, delay);

    const stopTimer = window.setTimeout(() => {
      setPlayingCells((previous) => {
        if (!(key in previous)) {
          return previous;
        }
        const next = { ...previous };
        delete next[key];
        return next;
      });
    }, delay + 300);

    timersRef.current.push(startTimer, stopTimer);
  };

  const triggerSound = (soundId: string, row: number, column: number, when: number): void => {
    const context = audioContextRef.current;
    const gain = masterGainRef.current;
    if (!context || !gain) {
      return;
    }

    const profile = profileById.get(soundId);
    if (!profile) {
      return;
    }

    const buffer = buffersRef.current.get(profile.url);
    if (!buffer) {
      return;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    source.start(when);

    flashCell(row, column, when);
  };

  const scheduleColumn = (column: number, when: number): void => {
    setPlayheadColumn(column);

    for (let row = 0; row < ROWS; row += 1) {
      const soundId = gridRef.current[row][column];
      if (soundId) {
        triggerSound(soundId, row, column, when);
      }
    }
  };

  const runScheduler = (): void => {
    const context = audioContextRef.current;
    if (!context) {
      return;
    }

    const scheduleAheadSeconds = 0.16;
    while (nextStepTimeRef.current < context.currentTime + scheduleAheadSeconds) {
      scheduleColumn(stepRef.current, nextStepTimeRef.current);
      stepRef.current = (stepRef.current + 1) % COLUMNS;
      const stepDuration = 60 / bpmRef.current;
      nextStepTimeRef.current += stepDuration;
    }
  };

  const stopPlayback = (): void => {
    if (schedulerRef.current !== null) {
      window.clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }

    for (const timerId of timersRef.current) {
      window.clearTimeout(timerId);
    }
    timersRef.current = [];

    setPlayingCells({});
    setIsPlaying(false);
    setPlayheadColumn(-1);
  };

  const startPlayback = async (): Promise<void> => {
    if (profiles.length === 0) {
      setStatus("No sounds available yet.");
      return;
    }

    try {
      const context = ensureAudioContext();
      if (context.state !== "running") {
        await context.resume();
      }

      setStatus("Loading active sounds...");
      await preloadUsedSounds();

      stepRef.current = 0;
      nextStepTimeRef.current = context.currentTime + 0.05;
      setIsPlaying(true);
      setStatus("Loop running.");

      runScheduler();
      schedulerRef.current = window.setInterval(runScheduler, 25);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Audio error: ${error.message}`
          : "Audio start error."
      );
      stopPlayback();
    }
  };

  const togglePlayback = (): void => {
    if (isPlaying) {
      stopPlayback();
      setStatus("Playback stopped.");
      return;
    }

    void startPlayback();
  };

  const previewSound = async (soundId: string): Promise<void> => {
    try {
      const context = ensureAudioContext();
      if (context.state !== "running") {
        await context.resume();
      }

      const profile = profileById.get(soundId);
      if (!profile) {
        return;
      }

      const buffer = await loadBufferBySoundId(soundId);
      const gain = masterGainRef.current;
      if (!gain) {
        return;
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      source.start(context.currentTime + 0.01);
      setStatus(`Preview: ${profile.label}`);
    } catch {
      setStatus("Could not preview this sound.");
    }
  };

  const handleDragStart =
    (soundId: string) => (event: DragEvent<HTMLButtonElement>): void => {
      event.dataTransfer.setData("text/plain", soundId);
      event.dataTransfer.effectAllowed = "copy";
    };

  const handleDragEnd = (): void => {
    setDragOverKey(null);
  };

  const handleDragOver =
    (row: number, column: number) => (event: DragEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      setDragOverKey(cellKey(row, column));
    };

  const handleDragLeave =
    (row: number, column: number) => (): void => {
      const key = cellKey(row, column);
      if (dragOverKey === key) {
        setDragOverKey(null);
      }
    };

  const handleDrop =
    (row: number, column: number) => (event: DragEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      const soundId = event.dataTransfer.getData("text/plain");
      if (soundId && profileById.has(soundId)) {
        assignSoundToCell(row, column, soundId);
        setStatus(`Dropped sound on row ${row + 1}, column ${column + 1}.`);
      }
      setDragOverKey(null);
    };

  const getRandomProfile = (category?: string): SoundProfile | null => {
    const pool =
      category && category !== "all" ? profilesByCategory.get(category) ?? [] : profiles;
    if (pool.length === 0) {
      return null;
    }
    return pool[Math.floor(Math.random() * pool.length)] ?? null;
  };

  const assignSoundToCell = (row: number, column: number, soundId: string): void => {
    setGrid((previous) =>
      previous.map((line, rowIndex) => {
        if (rowIndex !== row) {
          return line;
        }
        return line.map((cell, columnIndex) => {
          if (columnIndex !== column) {
            return cell;
          }
          return soundId;
        });
      })
    );
  };

  const openCellEditor = (row: number, column: number): void => {
    if (profiles.length === 0) {
      return;
    }

    const currentSoundId = grid[row][column];
    const currentProfile = currentSoundId ? profileById.get(currentSoundId) ?? null : null;
    const category = currentProfile?.category ?? categories[0] ?? "";
    const soundId = currentSoundId ?? profilesByCategory.get(category)?.[0]?.id ?? "";

    if (!category || !soundId) {
      return;
    }

    setEditor({
      row,
      column,
      category,
      soundId
    });
  };

  const handleCellClick = (
    row: number,
    column: number,
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    const currentSound = grid[row][column];

    if (event.altKey && currentSound) {
      void previewSound(currentSound);
      return;
    }

    if (addMode === "random") {
      const randomProfile = getRandomProfile(randomCategory);
      if (randomProfile) {
        assignSoundToCell(row, column, randomProfile.id);
        setStatus(
          `Random: ${randomProfile.label} on row ${row + 1}, column ${column + 1}.`
        );
      }
      return;
    }

    openCellEditor(row, column);
  };

  const updateEditorCategory = (category: string): void => {
    setEditor((previous) => {
      if (!previous) {
        return previous;
      }

      const fallbackSoundId = profilesByCategory.get(category)?.[0]?.id ?? "";
      return {
        ...previous,
        category,
        soundId: fallbackSoundId
      };
    });
  };

  const updateEditorSound = (soundId: string): void => {
    setEditor((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        soundId
      };
    });
  };

  const randomizeEditorSound = (): void => {
    if (!editor) {
      return;
    }
    const randomProfile = getRandomProfile(editor.category);
    if (!randomProfile) {
      return;
    }
    setEditor((previous) =>
      previous
        ? {
            ...previous,
            soundId: randomProfile.id
          }
        : previous
    );
  };

  const applyEditorValue = (): void => {
    if (!editor) {
      return;
    }

    const targetSound = profileById.get(editor.soundId);
    if (!targetSound) {
      return;
    }

    assignSoundToCell(editor.row, editor.column, editor.soundId);

    setStatus(
      `Assigned ${targetSound.label} to row ${editor.row + 1}, column ${editor.column + 1}.`
    );
    setEditor(null);
  };

  const clearEditorCell = (): void => {
    if (!editor) {
      return;
    }

    setGrid((previous) =>
      previous.map((row, rowIndex) => {
        if (rowIndex !== editor.row) {
          return row;
        }

        return row.map((cell, columnIndex) => {
          if (columnIndex !== editor.column) {
            return cell;
          }

          return null;
        });
      })
    );

    setStatus(`Cleared row ${editor.row + 1}, column ${editor.column + 1}.`);
    setEditor(null);
  };

  const randomizeEmptyCells = (): void => {
    if (profiles.length === 0) {
      return;
    }

    setGrid((previous) =>
      previous.map((row) =>
        row.map((cell) => {
          if (cell) {
            return cell;
          }
          const randomProfile = getRandomProfile(randomCategory);
          return randomProfile ? randomProfile.id : cell;
        })
      )
    );

    setStatus("Random fill applied to empty cells.");
  };

  const resetTemplate = (): void => {
    setGrid(createTemplateGrid(profiles));
    setEditor(null);
    setStatus("Template restored in first column.");
  };

  const clearGrid = (): void => {
    setGrid(createEmptyGrid());
    setEditor(null);
    setStatus("Grid cleared.");
  };

  return (
    <div className="page">
      <header className="toolbar" aria-label="Transport controls">
        <button className="primary" onClick={togglePlayback} type="button">
          {isPlaying ? "Stop" : "Play"}
        </button>

        <div className="mode-toggle" role="group" aria-label="Add mode">
          <button
            className={`mode-button ${addMode === "menu" ? "is-active" : ""}`}
            onClick={() => setAddMode("menu")}
            type="button"
          >
            Menu add
          </button>
          <button
            className={`mode-button ${addMode === "random" ? "is-active" : ""}`}
            onClick={() => setAddMode("random")}
            type="button"
          >
            Random add
          </button>
        </div>

        <label className="field random-field" htmlFor="random-category">
          <span>Random from</span>
          <select
            id="random-category"
            onChange={(event) => setRandomCategory(event.target.value)}
            value={randomCategory}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field bpm-field" htmlFor="bpm">
          <span>BPM {bpm}</span>
          <input
            id="bpm"
            max={148}
            min={72}
            onChange={(event) => setBpm(Number(event.target.value))}
            type="range"
            value={bpm}
          />
        </label>

        <button className="secondary" onClick={resetTemplate} type="button">
          Reset template
        </button>

        <button className="secondary" onClick={clearGrid} type="button">
          Clear all
        </button>

        <button className="secondary" onClick={randomizeEmptyCells} type="button">
          Random fill
        </button>
      </header>

      <main className="board-wrap">
        <section className="grid-board" aria-label="5 by 8 sound grid">
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLUMNS }, (_, column) => {
              const soundId = grid[row][column];
              const profile = soundId ? profileById.get(soundId) ?? null : null;
              const key = cellKey(row, column);
              const isCurrentColumn = isPlaying && playheadColumn === column;
              const isPlayingCell = Boolean(playingCells[key]);
              const isEditorOpen =
                editor !== null && editor.row === row && editor.column === column;
              const categorySounds = isEditorOpen
                ? profilesByCategory.get(editor.category) ?? []
                : [];
              const isDragOver = dragOverKey === key;

              return (
                <div
                  key={key}
                  className={[
                    "grid-cell",
                    soundId ? "is-active" : "",
                    isCurrentColumn ? "is-current-column" : "",
                    isPlayingCell ? "is-playing" : "",
                    profile ? `design-${profile.design}` : "",
                    profile ? `anim-${profile.animation}` : "",
                    isEditorOpen ? "is-editor-open" : "",
                    isDragOver ? "is-drag-over" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <button
                    aria-label={`Row ${row + 1}, column ${column + 1}`}
                    className="cell-hitbox"
                    onClick={(event) => handleCellClick(row, column, event)}
                    onDragOver={handleDragOver(row, column)}
                    onDragLeave={handleDragLeave(row, column)}
                    onDrop={handleDrop(row, column)}
                    type="button"
                  />

                  {profile && (
                    <span className="tile-shape" style={shapeStyle(profile)} aria-hidden="true">
                      <span className="design-layer" />
                    </span>
                  )}

                  {isEditorOpen && (
                    <div className="cell-editor" onClick={(event) => event.stopPropagation()}>
                      <label>
                        Category
                        <select
                          onChange={(event) => updateEditorCategory(event.target.value)}
                          value={editor.category}
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Sound
                        <select
                          onChange={(event) => updateEditorSound(event.target.value)}
                          value={editor.soundId}
                        >
                          {categorySounds.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="cell-editor-actions">
                        <button className="editor-btn" onClick={applyEditorValue} type="button">
                          Apply
                        </button>
                        <button className="editor-btn" onClick={clearEditorCell} type="button">
                          Clear
                        </button>
                        <button className="editor-btn" onClick={randomizeEditorSound} type="button">
                          Random
                        </button>
                        <button className="editor-btn" onClick={() => setEditor(null)} type="button">
                          Close
                        </button>
                        <button
                          className="editor-btn"
                          onClick={() => void previewSound(editor.soundId)}
                          type="button"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>

      <section className="inventory" aria-label="Sound inventory">
        {orderedCategories.map((category) => {
          const bucket = profilesByCategory.get(category) ?? [];
          return (
            <div className="inventory-group" key={category}>
              <div className="inventory-header">
                <span className="inventory-title">{category}</span>
                <span className="inventory-count">{bucket.length}</span>
              </div>
              <div className="inventory-grid">
                {bucket.map((profile) => (
                  <button
                    className="inventory-card"
                    draggable
                    key={profile.id}
                    onClick={() => void previewSound(profile.id)}
                    onDragStart={handleDragStart(profile.id)}
                    onDragEnd={handleDragEnd}
                    type="button"
                  >
                    <span
                      className={`swatch design-${profile.design} anim-${profile.animation}`}
                      style={shapeStyle(profile)}
                      aria-hidden="true"
                    >
                      <span className="design-layer" />
                    </span>
                    <span className="sound-name">{profile.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="categories" aria-label="Available categories">
        {orderedCategories.map((category) => (
          <span className="category-chip" key={category}>
            {category} ({profilesByCategory.get(category)?.length ?? 0})
          </span>
        ))}
      </section>

      <p className="status">{status}</p>
      <p className="hint">
        Tip: drag any sound tile into the grid. Click a tile to preview. Random mode assigns a random sound on click. Use `Alt + click` to preview a cell sound.
      </p>

      {isProfilesLoading && <p className="status">Loading sound catalog...</p>}
    </div>
  );
}
