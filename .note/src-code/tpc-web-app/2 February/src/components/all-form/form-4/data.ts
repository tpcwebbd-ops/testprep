export interface Form4Props {
  data?: IForm4Data | string;
}

export interface IForm4Data {
  formUid: string;
  formTitle: string;
  institutionName: string;
  qualification: string;
  passingYear: string;
  resultCGPA: string;
  englishTestType: string; // e.g., IELTS, PTE
  englishTestScore: string;
  submitButtonText: string;
}

export const defaultDataForm4: IForm4Data = {
  formUid: 'form-academic-uid-4',
  formTitle: 'Academic Qualifications',
  institutionName: 'North South University',
  qualification: 'Bachelor of Science',
  passingYear: '2023',
  resultCGPA: '3.50 out of 4.00',
  englishTestType: 'IELTS',
  englishTestScore: 'Overall 7.0',
  submitButtonText: 'Verify Academic Data',
};
