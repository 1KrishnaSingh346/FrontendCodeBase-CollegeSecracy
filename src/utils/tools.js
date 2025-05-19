export const saveCalculation = (toolName, data, preventDuplicates = false) => {
  try {
    const history = JSON.parse(localStorage.getItem(`tool_${toolName}`)) || [];
    
    if (preventDuplicates) {
      // Check if this exact calculation already exists
      const duplicateExists = history.some(item => {
        // Compare all relevant fields for uniqueness
        return (
          item.rank === data.rank &&
          item.state === data.state &&
          item.category === data.category &&
          item.gender === data.gender &&
          item.quota === data.quota
        );
      });

      if (duplicateExists) {
        return false; // Indicate that we didn't save a duplicate
      }
    }

    // Add new calculation to history
    const newHistory = [{
      ...data,
      timestamp: new Date().toISOString()
    }, ...history].slice(0, 5); // Keep last 5 calculations

    localStorage.setItem(`tool_${toolName}`, JSON.stringify(newHistory));
    return true; // Indicate successful save
  } catch (error) {
    console.error('Error saving calculation:', error);
    return false;
  }
};

export const getCalculations = (toolName) => {
  try {
    return JSON.parse(localStorage.getItem(`tool_${toolName}`)) || [];
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
};

export const clearToolHistory = (toolName) => {
  try {
    localStorage.removeItem(`tool_${toolName}`);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

// New function to delete a specific history item
export const deleteHistoryItem = (toolName, index) => {
  try {
    const history = JSON.parse(localStorage.getItem(`tool_${toolName}`)) || [];
    if (index >= 0 && index < history.length) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      localStorage.setItem(`tool_${toolName}`, JSON.stringify(updatedHistory));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting history item:', error);
    return false;
  }
};