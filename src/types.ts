export type StyleType = 'line' | 'side';
export type SummaryType = 'closed' | 'open' | 'hidden';
export type DiffStyleType = 'word' | 'char';
export type LineMatchingType = 'lines' | 'words' | 'none';
export type FormatType = 'html' | 'json';
export type InputType = 'file' | 'command' | 'stdin';
export type OutputType = 'preview' | 'stdout';
export type DiffyType = 'browser' | 'pbcopy' | 'print';

export type Configuration = {
  fileContentToggle: boolean;
  synchronisedScroll: boolean;
  showFilesOpen: boolean;
  highlightCode: boolean;
  formatType: FormatType;
  outputDestinationType: OutputType;
  outputDestinationFile?: string;
  inputSource: InputType;
  diffyType?: DiffyType;
  htmlWrapperTemplate: string;
  pageTitle: string;
  pageHeader: string;
  ignore: string[];
};
