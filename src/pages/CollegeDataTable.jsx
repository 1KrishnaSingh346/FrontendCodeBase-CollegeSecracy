import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const REQUIRED_COLUMNS = {
  'College Name': 'string',
  'Branch': 'string',
  'Quota': 'string',
  'Seat Type': 'string',
  'Gender': 'string',
  'Opening Rank': 'number',
  'Closing Rank': 'number',
};

const CollegeDataTable = () => {
  const [collegeData, setCollegeData] = useState([]);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const transformedData = transformCollegeData(jsonData);
        validateCollegeData(transformedData);
        setCollegeData(transformedData);
        setError('');
      } catch (err) {
        console.error('College data parsing failed:', err);
        setError(err.message);
        setCollegeData([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const validateCollegeData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No valid data found in the Excel sheet');
    }

    const firstRow = data[0];
    for (const [col, type] of Object.entries(REQUIRED_COLUMNS)) {
      if (!(col in firstRow)) {
        throw new Error(`Missing required column: ${col}`);
      }
      const value = firstRow[col];
      if (value !== null && typeof value !== type) {
        throw new Error(`Column ${col} should be of type ${type}`);
      }
    }

    data.forEach((row, index) => {
      if (row['Opening Rank'] > row['Closing Rank']) {
        throw new Error(
          `Row ${index + 1}: Opening Rank (${row['Opening Rank']}) cannot be greater than Closing Rank (${row['Closing Rank']})`
        );
      }
    });
  };

  const transformCollegeData = (data) => {
    return data.map((row) => {
      const transformed = {};
      for (const [col, type] of Object.entries(REQUIRED_COLUMNS)) {
        if (type === 'number') {
          transformed[col] = Number(row[col]);
          if (isNaN(transformed[col])) {
            throw new Error(`Invalid number value in ${col}: ${row[col]}`);
          }
        } else {
          transformed[col] = String(row[col]).trim();
          if (!transformed[col]) {
            throw new Error(`Empty value in required column ${col}`);
          }
        }
      }
      return transformed;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Upload College Data</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="px-4 py-2 border rounded bg-white shadow"
        />
      </div>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      {collegeData.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {Object.keys(collegeData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 text-left border-b border-indigo-500">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {collegeData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-4 py-2 border-b border-gray-200">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CollegeDataTable;
