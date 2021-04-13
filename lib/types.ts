export interface CliParams {
  // LP midi device input
  lpiMidiDevice: string

  // LP midi device output
  lpoMidiDevice: string

  // virtual lp-seq midi device 
  lsseqMidiDevice: string

  // indicates the ports should be listed
  listPorts?: boolean
}

export type OnMessage = (deltaTime: number, message: number[]) => void

export interface MidiPort {
  readonly name: string;
  close(): void
  sendMessage(bytes: number[]): void
}

export interface CreateMidiPortsParams {
  name: string
  onMessage: OnMessage
}

export interface Note {
  channel?:  number; // 1-16 grumble
  note?:     number; // 0 - 127
  velocity?: number; // 0 - 127
  length?:   number; // 0 - 127 (24 ppqn)
  offset?:   number; // -23 - 23 (24 ppqn)
}

// the notes that make up a single pattern
export interface Pattern {
  defaultNote: Note;
  notes: Note[]; 
}

// the patterns of all the instruments played together
export interface Scene {
  defaultNote: Note;
  patterns: Pattern[];
}

export interface Track {
  defaultNote: Note;
  scenes: Scene;
}

export interface Song {
  defaultNote: Note;
  tracks: Track[];
}