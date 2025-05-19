import React from "react";

const MentorTable = ({ mentors }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Verified Mentors</h2>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Verified On</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor) => (
            <tr key={mentor.id} className="border-b">
              <td className="p-2">{mentor.name}</td>
              <td className="p-2">{mentor.email}</td>
              <td className="p-2">{mentor.verifiedOn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MentorTable;
