export interface StudentValue {
  _id?: string;
  Name: string;
  Class: string;
  Roll: number;
}

export const createStudentId = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

export const parseStudentsValue = (value: string): StudentValue[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object')
      .map(item => ({
        _id: typeof item._id === 'string' ? item._id : createStudentId(),
        Name: typeof item.Name === 'string' ? item.Name : '',
        Class: typeof item.Class === 'string' ? item.Class : '',
        Roll: typeof item.Roll === 'number' ? item.Roll : Number(item.Roll) || 0,
      }));
  } catch {
    return [];
  }
};

export const stringifyStudentsValue = (value: StudentValue[]) => JSON.stringify(value);
