import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Survey questions data structure - including user info as questions
  const surveyQuestions = [
    // User info questions
    { id: 1, question: "Name", type: "Text", options: [] },
    { id: 2, question: "Email", type: "Text", options: [] },
    { id: 3, question: "Phone Number", type: "Text", options: [] },
    { 
      id: 4, 
      question: "Country", 
      type: "Drop-Down", 
      options: [] // Will be populated from API
    },
    { 
      id: 5, 
      question: "State", 
      type: "Drop-Down", 
      options: [] // Will be populated based on selected country
    },
    
    // Original survey questions starting from id 6
    { id: 6, question: "What job search tasks can you do daily?", type: "Text", options: [] },
    { 
      id: 7, 
      question: "What is your current salary?", 
      type: "Drop-Down", 
      options: [
        "Less than $40,000",
        "$40,000 - $60,000",
        "$60,000 - $80,000",
        "$80,000 - $100,000",
        "$100,000+" 
      ] 
    },
    { 
      id: 8, 
      question: "What is your expected salary range for your next role?", 
      type: "Drop-Down", 
      options: [
        "Less than $50,000",
        "$50,000 - $70,000",
        "$70,000 - $90,000",
        "$90,000 - $120,000",
        "$120,000+" 
      ] 
    },
    { id: 9, question: "List two job titles you are actively applying for?", type: "Text", options: [] },
    { 
      id: 10, 
      question: "What is your highest educational qualification?", 
      type: "Drop-Down", 
      options: [
        "High School Diploma",
        "Associate's Degree",
        "Bachelor's Degree",
        "Master's Degree",
        "Doctoral/PhD" 
      ] 
    },
    { 
      id: 11, 
      question: "How many hours per day can you dedicate to job searching?", 
      type: "Drop-Down", 
      options: [
        "Less than 1 hour",
        "1 - 2 hours",
        "2 - 4 hours",
        "4+ hours",
        "Full-time commitment" 
      ] 
    },
    { 
      id: 12, 
      question: "Which industry are you targeting for your next job?", 
      type: "Drop-Down", 
      options: [
        "Technology",
        "Finance/Accounting",
        "Healthcare",
        "Marketing/Sales",
        "Education/Training"
      ] 
    },
    { 
      id: 13, 
      question: "Have you contacted any recruiter directly?", 
      type: "Drop-Down", 
      options: [
        "Yes, I have reached out",
        "No, I haven't yet",
        "I'm in the process of reaching out",
        "I prefer to be contacted by recruiters"
      ] 
    },
    { 
      id: 14, 
      question: "How soon are you looking to achieve your goal?", 
      type: "Drop-Down", 
      options: [
        "Within 1 month",
        "1-3 months",
        "3-6 months",
        "6 months or more",
        "No set timeline" 
      ] 
    },
    { 
      id: 15, 
      question: "What are the most critical factors for you when considering a job?", 
      type: "Drop-Down", 
      options: [
        "Salary & Benefits",
        "Work-Life Balance",
        "Career Growth Opportunities",
        "Company Culture & Values",
        "Job Stability & Security" 
      ] 
    },
    { 
      id: 16, 
      question: "Which of the following skills do you feel most confident about?", 
      type: "Drop-Down", 
      options: [
        "Communication Skills",
        "Leadership/Management",
        "Problem Solving/Analytical",
        "Technical/IT Skills",
        "Sales/Marketing Skills" 
      ] 
    },
    { 
      id: 17, 
      question: "What tools or platforms are you using for your job search?", 
      type: "Drop-Down", 
      options: [
        "LinkedIn",
        "Indeed",
        "Glassdoor",
        "Company Websites",
        "Networking/Referrals" 
      ] 
    },
    { 
      id: 18, 
      question: "How many job applications do you plan to send per week?", 
      type: "Drop-Down", 
      options: [
        "Less than 5",
        "5 - 10",
        "10 - 20",
        "20+",
        "I don't have a specific plan yet" 
      ] 
    },
    { id: 19, question: "What skills would you like to improve or acquire to be more competitive in your job search?", type: "Text", options: [] },
  ];

  // State to track form responses
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for managing countries and states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  
  // For n8n webhook
  const webhookUrl = 'https://toolsagentn8n.app.n8n.cloud/webhook/Job-Helper-Automation';
  
  // Fetch countries when component mounts
  useEffect(() => {
    fetchCountries();
  }, []);
  
  // Fetch states when country changes
  useEffect(() => {
    if (responses[4] && typeof responses[4] === 'string') {
      fetchStates(responses[4]);
    } else {
      setStates([]);
    }
  }, [responses[4]]);
  
  // Fetch countries from API
  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      
      if (data.error === false && data.data) {
        // Extract country names - ensures we only get the country name strings
        const countryNames = data.data.map(countryObj => countryObj.country);
        setCountries(countryNames);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      
      // Fallback to hardcoded countries if API fails
      const fallbackCountries = [
        "India", "United States", "United Kingdom", "Canada", 
        "Australia", "Germany", "France", "Japan", "China", "Other"
      ];
      setCountries(fallbackCountries);
    } finally {
      setIsLoadingCountries(false);
    }
  };
  
  // Fetch states for a specific country
  const fetchStates = async (country) => {
    setIsLoadingStates(true);
    try {
      // Ensure country is a string before sending the request
      if (typeof country !== 'string') {
        console.error('Invalid country format:', country);
        setStates(["Invalid country format"]);
        setIsLoadingStates(false);
        return;
      }
      
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
      });
      
      const data = await response.json();
      
      if (data.error === false && data.data && data.data.states) {
        // Extract state names and ensure they're all strings
        const stateNames = data.data.states
          .map(state => state.name)
          .filter(name => typeof name === 'string');
        
        setStates(stateNames);
        
        // If current state selection is not valid for new country, reset it
        if (responses[5] && !stateNames.includes(responses[5])) {
          setResponses(prev => ({ ...prev, 5: '' }));
        }
      } else {
        // If no states found or error, set to empty array
        setStates(["Not Applicable"]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates(["Error loading states"]);
    } finally {
      setIsLoadingStates(false);
    }
  };
  
  // Questions per page
  const questionsPerPage = 5;
  const totalPages = Math.ceil(surveyQuestions.length / questionsPerPage);
  
  // Get current page questions
  const getCurrentQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return surveyQuestions.slice(start, end);
  };

  // Handle survey input change
  const handleInputChange = (id, value) => {
    setResponses({
      ...responses,
      [id]: value
    });
    setShowError(false);
  };

  // Handle page navigation
  const goToNextPage = () => {
    // Check if all questions on current page are answered
    const currentQuestions = getCurrentQuestions();
    const allAnswered = currentQuestions.every(q => responses[q.id]);
    
    if (!allAnswered) {
      setShowError(true);
      return;
    }
    
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setShowError(false);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setShowError(false);
    }
  };

  // Validate email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate phone number (simple 10-digit check)
  const isValidPhoneNumber = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  // Validate responses before submission
  const validateResponses = () => {
    // Check if email is valid
    if (!isValidEmail(responses[2])) {
      alert('Please enter a valid email address');
      return false;
    }
    
    // Check if phone number is valid
    if (!isValidPhoneNumber(responses[3])) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check if all questions are answered
    const allAnswered = surveyQuestions.every(q => responses[q.id]);
    
    if (!allAnswered) {
      setShowError(true);
      return;
    }
    
    // Validate critical fields
    if (!validateResponses()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for webhook
      const formattedData = {
        // Personal info
        name: responses[1], // ID 1 is Name
        email: responses[2], // ID 2 is Email
        phone: responses[3], // ID 3 is Phone
        country: responses[4], // ID 4 is Country
        state: responses[5], // ID 5 is State
        
        // Survey responses
        responses: Object.entries(responses)
          .filter(([id]) => parseInt(id) >= 6) // Only survey questions
          .map(([id, answer]) => ({
            questionId: parseInt(id),
            question: surveyQuestions.find(q => q.id === parseInt(id))?.question,
            answer
          }))
      };
      
      // Send to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Show success
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting the survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the question based on its type (text or dropdown)
  const renderQuestion = (question) => {
    switch (question.type) {
      case "Text":
        return (
          <div key={question.id} className="question-container">
            <label className="question-label">
              {question.id}. {question.question}
            </label>
            <textarea
              className="text-input"
              rows="3"
              value={responses[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={`Enter your ${question.question.toLowerCase()}`}
            />
          </div>
        );
      case "Drop-Down":
        return (
          <div key={question.id} className="question-container">
            <label className="question-label">
              {question.id}. {question.question}
            </label>
            <select
              className="dropdown-select"
              value={responses[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              disabled={
                (question.id === 4 && isLoadingCountries) || 
                (question.id === 5 && (isLoadingStates || !responses[4]))
              }
            >
              <option value="">
                {(question.id === 4 && isLoadingCountries) ? "Loading countries..." : 
                 (question.id === 5 && isLoadingStates) ? "Loading states..." :
                 (question.id === 5 && !responses[4]) ? "Select a country first" :
                 `Select ${question.question}`}
              </option>
              {question.id === 4 && Array.isArray(countries) ? (
                // Render countries for question 4
                countries.map((country, index) => (
                  <option key={index} value={typeof country === 'string' ? country : ''}>
                    {typeof country === 'string' ? country : 'Invalid country'}
                  </option>
                ))
              ) : question.id === 5 && Array.isArray(states) ? (
                // Render states for question 5
                states.map((state, index) => (
                  <option key={index} value={typeof state === 'string' ? state : ''}>
                    {typeof state === 'string' ? state : 'Invalid state'}
                  </option>
                ))
              ) : (
                // Render options for other dropdown questions
                Array.isArray(question.options) && question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))
              )}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  // Render success message
  if (isSubmitted) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="header-title">Job Search Survey</h1>
          </div>
        </header>
        
        <div className="success-container">
          <div className="success-icon">
            ✓
          </div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-message">
            Your job search survey has been submitted successfully. We appreciate your feedback!
          </p>
          <div className="success-button-container">
            <button
              onClick={() => {
                setResponses({});
                setCurrentPage(0);
                setIsSubmitted(false);
              }}
              className="button primary-button"
            >
              Submit Another Response
            </button>
          </div>
        </div>
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Job Search Survey. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Show loading state when fetching initial countries
  if (isLoadingCountries && currentPage === 0) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="header-title">Job Search Survey</h1>
          </div>
        </header>
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading survey...</p>
        </div>
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Job Search Survey. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Render the form
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
        <h1 className="header-title">1to10x</h1>
          <h1 className="header-subtitle">Job Search Survey</h1>
        </div>
      </header>
      
      <main className="main-content">
        <div className="survey-container">
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">
              Page {currentPage + 1} of {totalPages}
            </p>
          </div>

          {showError && (
            <div className="error-message">
              <div className="error-icon">!</div>
              <p>Please answer all questions before proceeding.</p>
            </div>
          )}

          <div className="questions-section">
            {getCurrentQuestions().map(question => renderQuestion(question))}
          </div>
          
          <div className="button-container">
            <button
              type="button"
              onClick={goToPreviousPage}
              className={`button ${
                currentPage === 0
                  ? "disabled-button"
                  : "secondary-button"
              }`}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            
            {currentPage === totalPages - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="button primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextPage}
                className="button primary-button"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} 1to10x. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;