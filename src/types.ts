export type LabStatus = 'normal' | 'high' | 'low';
export type ResultType = 'good' | 'attention' | 'alert' | 'info';

export interface LabResult {
  test: string;
  value: string;
  unit: string;
  ref: string;
  status: LabStatus;
}

export interface AiResult {
  type: ResultType;
  title: string;
  value: string;
  explain: string;
}

export interface ChatQA {
  keywords: string[];
  question: string;
  answer: string;
}

export interface PatientData {
  name: string;
  age: number;
  context: string;
  date: string;
  lab: LabResult[];
  ai: {
    greeting: string;
    results: AiResult[];
    summary: string;
    actions: string[];
  };
  chatQA: ChatQA[];
}
