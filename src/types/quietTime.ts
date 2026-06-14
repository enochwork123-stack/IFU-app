export interface QuietTimeEntry {
  id: string;
  title: string;
  book: string;
  passage: string;
  scriptureText: string;
  content: string[];
  reflection: string[];
  prayer: string;
  topics: string[];
  dateAdded: string; // ISO date string (YYYY-MM-DD)
}
