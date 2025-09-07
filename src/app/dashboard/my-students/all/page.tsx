'use client';

import React, { useState, useMemo } from 'react';
import { create } from 'zustand';

// Types
interface Student {
  id: number;
  studentName: string;
  startCourse: string;
  endCourse: string;
  courseName: string;
  totalModuleComplete: string;
  lastCompleteTime: string;
}

interface StudentStore {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: number, student: Partial<Student>) => void;
  deleteStudent: (id: number) => void;
}

// Zustand Store
const useStudentStore = create<StudentStore>(set => ({
  students: [],
  setStudents: students => set({ students }),
  addStudent: student => set(state => ({ students: [...state.students, student] })),
  updateStudent: (id, updatedStudent) =>
    set(state => ({
      students: state.students.map(student => (student.id === id ? { ...student, ...updatedStudent } : student)),
    })),
  deleteStudent: id =>
    set(state => ({
      students: state.students.filter(student => student.id !== id),
    })),
}));

// Generate sample data function
const generateStudents = (): Student[] => {
  const courses = ['IELTS', 'TOEFL', 'SAT', 'GRE', 'GMAT', 'PTE', 'Duolingo'];
  const names = [
    'Abdul',
    'Ahmed',
    'Fatima',
    'Hassan',
    'Aisha',
    'Omar',
    'Zara',
    'Ali',
    'Noor',
    'Yusuf',
    'Mariam',
    'Khalid',
    'Layla',
    'Ibrahim',
    'Safiya',
    'Tariq',
    'Amina',
    'Rashid',
    'Khadija',
    'Saeed',
    'Leila',
    'Mustafa',
    'Yasmin',
    'Bilal',
    'Zahra',
    'Hamza',
    'Ruqayya',
    'Usman',
    'Halima',
    'Ismail',
  ];

  const students: Student[] = [];

  for (let i = 1; i <= 100; i++) {
    const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
    const lastCompleteDate = new Date(startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime()));

    students.push({
      id: 100 + i,
      studentName: names[Math.floor(Math.random() * names.length)],
      startCourse: startDate.toLocaleDateString('en-GB'),
      endCourse: endDate.toLocaleDateString('en-GB'),
      courseName: courses[Math.floor(Math.random() * courses.length)],
      totalModuleComplete: Math.floor(Math.random() * 50).toString(),
      lastCompleteTime: `${lastCompleteDate.toLocaleDateString('en-GB')}::${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, '0')}${Math.random() > 0.5 ? 'PM' : 'AM'}`,
    });
  }

  return students;
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Student Form Component
const StudentForm: React.FC<{
  student?: Student;
  onSubmit: (student: Student) => void;
  onCancel: () => void;
}> = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    studentName: student?.studentName || '',
    startCourse: student?.startCourse || '',
    endCourse: student?.endCourse || '',
    courseName: student?.courseName || '',
    totalModuleComplete: student?.totalModuleComplete || '',
    lastCompleteTime: student?.lastCompleteTime || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: student?.id || Date.now(),
      ...formData,
    };
    onSubmit(newStudent);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Course</label>
        <input
          type="text"
          name="startCourse"
          value={formData.startCourse}
          onChange={handleChange}
          placeholder="DD/MM/YYYY"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Course</label>
        <input
          type="text"
          name="endCourse"
          value={formData.endCourse}
          onChange={handleChange}
          placeholder="DD/MM/YYYY"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
        <select
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Course</option>
          <option value="IELTS">IELTS</option>
          <option value="TOEFL">TOEFL</option>
          <option value="SAT">SAT</option>
          <option value="GRE">GRE</option>
          <option value="GMAT">GMAT</option>
          <option value="PTE">PTE</option>
          <option value="Duolingo">Duolingo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Total Module Complete</label>
        <input
          type="number"
          name="totalModuleComplete"
          value={formData.totalModuleComplete}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Complete Time</label>
        <input
          type="text"
          name="lastCompleteTime"
          value={formData.lastCompleteTime}
          onChange={handleChange}
          placeholder="DD/MM/YYYY::HH:MMAM/PM"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
          {student ? 'Update' : 'Add'} Student
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};

// Student Details Component
const StudentDetails: React.FC<{ student: Student }> = ({ student }) => {
  return (
    <div className="space-y-3">
      <div>
        <strong>ID:</strong> {student.id}
      </div>
      <div>
        <strong>Name:</strong> {student.studentName}
      </div>
      <div>
        <strong>Course:</strong> {student.courseName}
      </div>
      <div>
        <strong>Start Date:</strong> {student.startCourse}
      </div>
      <div>
        <strong>End Date:</strong> {student.endCourse}
      </div>
      <div>
        <strong>Modules Completed:</strong> {student.totalModuleComplete}
      </div>
      <div>
        <strong>Last Activity:</strong> {student.lastCompleteTime}
      </div>
    </div>
  );
};

// Main Page Component
export default function StudentsPage() {
  const { students, setStudents, addStudent, updateStudent, deleteStudent } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Initialize data on first render
  React.useEffect(() => {
    if (students.length === 0) {
      setStudents(generateStudents());
    }
  }, [students.length, setStudents]);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return students.filter(
      student =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm),
    );
  }, [students, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAddStudent = (student: Student) => {
    addStudent(student);
    setShowAddModal(false);
  };

  const handleEditStudent = (student: Student) => {
    if (selectedStudent) {
      updateStudent(selectedStudent.id, student);
      setShowEditModal(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
          <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Add Student
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, course, or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Students Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.startCourse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.endCourse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalModuleComplete}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleViewStudent(student)} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded">
                        View
                      </button>
                      <button onClick={() => handleEditClick(student)} className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</span> of{' '}
                  <span className="font-medium">{filteredStudents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student">
        <StudentForm onSubmit={handleAddStudent} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        title="Edit Student"
      >
        {selectedStudent && (
          <StudentForm
            student={selectedStudent}
            onSubmit={handleEditStudent}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedStudent(null);
        }}
        title="Student Details"
      >
        {selectedStudent && <StudentDetails student={selectedStudent} />}
      </Modal>
    </div>
  );
}
