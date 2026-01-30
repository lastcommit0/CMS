export interface EpaperInput {
  title: string;
  type: "E_PAPER" | "MAGAZINE";
  pdfUrl: string;
  pages: string[]; 
  authorId: string;
}
