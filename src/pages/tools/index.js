import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy load all tool components
const ToolsPage = lazy(() => import("../../pages/ToolsPage"));
const RankCalculator = lazy(() => import("./RankCalculator"));
const PercentileCalculator = lazy(() => import("./PercentileCalculator"));
const CollegePredictor = lazy(() => import("./CollegePredictor"));
const CGPACalculator = lazy(() => import("./CGPACalculator"));
const MarkingScheme = lazy(() => import("./MarkingScheme"));
const CutoffAnalyzer = lazy(() => import("./CutoffAnalyzer"));
const ExamTools = lazy(() => import("./ExamTools"));
const ExamPlanner = lazy(() => import("./StudyPlanner"));
// const JEETools = lazy(() => import("./JEETools")); // JEE-specific tools
// const NEETTools = lazy(() => import("./NEETTools")); // NEET-specific tools

const toolsRoutes = [
  // Individual tools - these should come first
  {
    path: "/tools/rank-calculator",
    element: <RankCalculator />,
  },
  {
    path: "/tools/percentile-calculator",
    element: <PercentileCalculator />,
  },
  {
    path: "/tools/college-predictor",
    element: <CollegePredictor />,
  },
  {
    path: "/tools/cgpa-calculator",
    element: <CGPACalculator />,
  },
  {
    path: "/tools/marking-scheme",
    element: <MarkingScheme />,
  },
  {
    path: "/tools/cutoff-analyzer",
    element: <CutoffAnalyzer />,
  },
  {
    path: "/tools/exam-tools",
    element: <ExamTools />,
  },
  {
    path: "/tools/exam-planner",  // Fixed case consistency
    element: <ExamPlanner />,
  },
  // Main tools page - comes after specific routes
  {
    path: "/tools",
    element: <ToolsPage />,
  },

    // Exam-specific tool collections
//   {
//     path: "/tools/jee",
//     element: <JEETools />,
//   },
//   {
//     path: "/tools/neet",
//     element: <NEETTools />,
//   },
  // Fallback route
  {
    path: "*",
    element: <Navigate to="/tools" replace />,
  }
];

export default toolsRoutes;