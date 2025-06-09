import api from "@/lib/axios";

export const fetchCollegeData = async (counsellingType, round, year) => {
  try {
    // Build the URL with proper parameter order (type/year/round)
    let url = `/api/v1/mentee/get-college-data/${counsellingType}`;
    // Handle year parameter (default to current year if not provided)
    const effectiveYear = year && year !== 'current' ? year : 2024;
    url += `/${effectiveYear}/${round}`;

    const response = await api.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
       withCredentials: true 
    }); 

    // Transform response to match CollegePredictor's expected format
    if (response.data.status === 'success') {
      return {
      counsellingType: response.data.counsellingType || counsellingType,
      round: round,
      year: effectiveYear,
      data: response.data.data.map(college => ({
        Institute: college.Institute,
        "Academic Program Name": college.Program || college["Academic Program Name"],
        Quota: college.Quota,
        "Seat Type": college["Seat Type"] || college.Category,
        Gender: college.Gender || college["Seat Gender"],
        "Opening Rank": college["Opening Rank"],
        "Closing Rank": college["Closing Rank"],
        Round: college.Round,
        State: college.State,
        Category: college.Category  // Make sure this is included
      })),
      dataCount: response.data.data.length,
      requestedAt: new Date().toISOString()
    };
    }

    throw new Error(response.data.message || 'Invalid response format');

  } catch (error) {
    // Enhanced error handling with CollegePredictor-specific messages
    let errorMessage = 'Failed to fetch college data';
    
    if (error.response) {
        if (error.response.status === 404) {
    // Return empty data structure that matches expected format
    return {
      counsellingType,
      round,
      year: 2024,
      data: [],
      dataCount: 0,
      requestedAt: new Date().toISOString()
    };
  }
      if (error.response.status === 401) {
        errorMessage = 'Session expired - please login again';
      } else if (error.response.status === 403) {
        errorMessage = 'Your account does not have access to this data';
      } else if (error.response.status === 404) {
        errorMessage = `No ${counsellingType} data available for round ${round}`;
        if (year) errorMessage += ` in ${year}`;
      } else {
        errorMessage = error.response.data?.message || 
                      `Server error (${error.response.status})`;
      }
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Cannot connect to server - check your internet connection';
    }

    throw new Error(errorMessage);
  }
};