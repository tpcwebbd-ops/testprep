// app/dashboard/batch/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Batch, ApiResponse } from './types'; // Adjust the import path as needed

const BatchesPage = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 10; // Items per page

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, you would fetch from your API endpoint
        // For demonstration, we'll use the provided JSON structure
        const res: ApiResponse = {
          data: {
            batches: [
              // Paste the "batches" array from your example JSON here
              // For a real-world scenario, you would fetch this data
              {
                _id: '68bd5c690de8a5ce02f64474',
                batchInfo: 'Description of the batch',
                batchName: 'IELTS Batch 100',
                mentorInfo: [
                  {
                    mentorName: 'Name of Mentor',
                    mentorEmail: 'example@gmail.com',
                    studentsLst: [
                      {
                        studentName: 'Name of Student',
                        studentEmail: 'example@gamil.com',
                        studentCourse: 'studentCourse',
                        startDate: '1/1/2025',
                        endDate: '31/8/2025',
                        attendanceLst: [],
                        _id: '68bd5c690de8a5ce02f64476',
                      },
                    ],
                    _id: '68bd5c690de8a5ce02f64475',
                  },
                ],
                createdAt: '2025-09-07T10:20:25.644Z',
                updatedAt: '2025-09-07T10:20:25.644Z',
                __v: 0,
              },
              // Add more batch objects for testing pagination and search
              {
                _id: '68bd5c690de8a5ce02f64475',
                batchInfo: 'Another batch description',
                batchName: 'TOEFL Prep',
                mentorInfo: [],
                createdAt: '2025-09-08T10:20:25.644Z',
                updatedAt: '2025-09-08T10:20:25.644Z',
                __v: 0,
              },
            ],
            total: 2, // Update with the total number of batches
            page: 1,
            limit: 10,
          },
          message: 'Batches fetched successfully',
          status: 200,
        };

        setBatches(res.data.batches);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        setError('Failed to fetch batches.');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [currentPage]);

  const handleAdd = () => {
    // Implement your add logic here, e.g., open a modal
    alert('Add new batch');
  };

  const handleEdit = (id: string) => {
    // Implement your edit logic here
    alert(`Edit batch with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement your delete logic here
    if (window.confirm('Are you sure you want to delete this batch?')) {
      alert(`Delete batch with ID: ${id}`);
      // Filter out the deleted batch
      setBatches(batches.filter(batch => batch._id !== id));
    }
  };

  const handleView = (id: string) => {
    // Implement your view logic here, e.g., navigate to a details page
    alert(`View batch with ID: ${id}`);
  };

  const filteredBatches = useMemo(() => {
    return batches.filter(batch => batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [batches, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Batch Management</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search batches..."
          className="border rounded px-2 py-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Batch
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <BatchTable batches={filteredBatches} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};

// --- Sub-components for better structure ---

interface BatchTableProps {
  batches: Batch[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ batches, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Batch Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map(batch => (
            <tr key={batch._id}>
              <td className="py-2 px-4 border-b">{batch.batchName}</td>
              <td className="py-2 px-4 border-b">{batch.batchInfo}</td>
              <td className="py-2 px-4 border-b">{new Date(batch.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => onView(batch._id)} className="text-blue-500 hover:underline mr-2">
                  View
                </button>
                <button onClick={() => onEdit(batch._id)} className="text-green-500 hover:underline mr-2">
                  Edit
                </button>
                <button onClick={() => onDelete(batch._id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-4 flex justify-center">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 border rounded mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default BatchesPage;
