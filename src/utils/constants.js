import { logo, e1, e2, e3, e4, e5, e6, new1, new2, new3, Krishna, Chandrashen} from "../assets/script";


const info = [
    {
        url : new1,
        title : 'Enroll & Aspire',
        Description : 'Fill out a quick form to showcase your skills and expertise'
    },
    {
        url : new2,
        title : 'Get Verified',
        Description : 'Our team will evaluate your application to ensure quality and credibility'
    },
    {
        url : new3,
        title : 'Live & Connect',
        Description : 'Start guiding mentees and sharing your valuable insights'
    }
]

const quality = [
  {
      url : e4,
      title : 'Personalized Mentorship',
      Description : 'Discover secret details and untold stories about colleges, shared directly by experienced mentors to help you choose the best fit.',
  },
    {
        url : e5,
        title : 'Exclusive College Insights',
        Description : 'Connect with mentors who are current students or alumni from your dream college. Ask your queries and gain insider tips to make informed decisions.',
    },
    {
        url : e6,
        title : 'Tailored Guidance',
        Description : 'Our platform matches you with mentors based on your interests and goals, ensuring a customized and effective mentoring experience',
    },
]

const userData = [
    {
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      name: 'Krishna Singh',
      testimonial: '“CollegeSecracy helped me connect with a mentor from my dream college. Their guidance on campus life and opportunities was amazing.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      name: 'Ravi Kumar',
      testimonial: '“Thanks to CollegeSecracy, I was able to connect with industry professionals who guided me on the right career path. It truly transformed my approach to academics.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      name: 'Amit Sharma',
      testimonial: '“The mentorship I received was priceless. I had the chance to interact with top professionals in my field, and their advice helped me secure internships.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      name: 'Priya Verma',
      testimonial: '“Being a first-generation student, I didn’t know where to start. CollegeSecracy connected me with mentors who made the journey much easier and more rewarding.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
      name: 'Neha Gupta',
      testimonial: '“I was struggling to find the right career guidance, but through CollegeSecracy, I found mentors who understood my aspirations and helped me grow professionally.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
      name: 'Sandeep Reddy',
      testimonial: '“The platform was a game-changer for me. I had access to a network of mentors who provided insight into career growth and life after college.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
      name: 'Simran Kaur',
      testimonial: '“I was able to clarify my doubts about my college course and career plans, thanks to the mentorship program at CollegeSecracy. It really helped me find direction.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
      name: 'Rahul Patel',
      testimonial: '“CollegeSecracy opened doors to incredible mentorship opportunities. The real-world experience and advice I received gave me the confidence to pursue my dream job.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
      name: 'Ritika Joshi',
      testimonial: '“With CollegeSecracy, I not only received mentorship but also developed valuable skills through hands-on guidance that helped me land my first job.”',
    },
    {
      profileImage: 'https://randomuser.me/api/portraits/men/6.jpg',
      name: 'Vikram Singh',
      testimonial: '“CollegeSecracy helped me connect with like-minded individuals, which turned into a mentorship relationship that shaped my career.”',
    },
  ];



// Home Page FAQs (General & Platform-Related)
const homePageFAQs = [
  {
    question: "What is CollegeSecracy?",
    answer: "CollegeSecracy is a platform designed to help students access educational tools, notes, assignments, and discussion forums, making learning more efficient."
  },
  {
    question: "Who can use CollegeSecracy?",
    answer: "Any student, educator, or academic professional can use CollegeSecracy."
  },
  {
    question: "How do I register on CollegeSecracy?",
    answer: "Click the 'Sign Up' button on the homepage and follow the registration process."
  },
  {
    question: "What features does CollegeSecracy offer?",
    answer: "CollegeSecracy provides: Study Notes & Resources, Internship & Career Opportunities, Discussion Forums, Project Collaboration."
  },
  {
    question: "Is CollegeSecracy free to use?",
    answer: "Yes, most of the resources are free. Some premium features may require a subscription."
  },
  {
    question: "Can I contribute my own notes or assignments?",
    answer: "Yes! You can upload study materials to help other students."
  },
  {
    question: "Does CollegeSecracy offer internship opportunities?",
    answer: "Yes! We provide internship listings in various domains. Check the 'Career' section for details."
  },
  {
    question: "How can I apply for an internship?",
    answer: "You can visit the 'Career' section, find a suitable internship, and apply directly."
  },
  {
    question: "Do I get a certificate for contributing study materials?",
    answer: "Yes! Regular contributors may receive a certificate of appreciation."
  }
];

// Contact Page FAQs (Support & Help)
const contactPageFAQs = [
  {
    question: "I forgot my password. How do I reset it?",
    answer: "Click on 'Forgot Password' on the login page and follow the instructions."
  },
  {
    question: "I haven't received a verification email. What should I do?",
    answer: "Check your spam/junk folder. If it's not there, request a new verification email."
  },
  {
    question: "I'm facing login issues. What can I do?",
    answer: "Clear your browser cache and try again. If the issue persists, contact support."
  },
  {
    question: "Why is my uploaded study material not visible?",
    answer: "Uploaded materials go through a review process before appearing on the site."
  },
  {
    question: "Can I delete my CollegeSecracy account?",
    answer: "Yes, go to 'Account Settings > Delete Account' or contact support."
  },
  {
    question: "How long does it take to get a response from support?",
    answer: "We usually respond within 24-48 hours."
  },
  {
    question: "Do you offer live chat or phone support?",
    answer: "Yes! You can reach us via live chat (Telegram) or call us directly."
  },
  {
    question: "Where can I find CollegeSecracy's contact details?",
    answer: "Check our 'Contact Us' page for email, phone, and chat support."
  }
];

const TermsAndConditons = [
  {
    title: "1. Introduction",
    content:
      "Welcome to CollegeSecracy. These Terms and Conditions govern your use of our platform. By accessing or using our services, you agree to be bound by these terms.",
  },
  {
    title: "2. User Responsibilities",
    content: "",
    list: [
      "You must be at least 18 years old to use CollegeSecracy.",
      "Provide accurate and complete information while registering.",
      "Do not share your account credentials with others.",
      "Respect the community and avoid harmful behavior.",
    ],
  },
  {
    title: "3. Privacy & Data Protection",
    content:
      "We prioritize your privacy. Your data is stored securely, and we do not sell your personal information to third parties. Read our ",
    link: { text: "Privacy Policy", href: "/privacy" },
  },
  {
    title: "4. Prohibited Activities",
    list: [
      "No illegal, misleading, or offensive content is allowed.",
      "Do not attempt to hack, manipulate, or misuse our services.",
      "Spamming, phishing, or unauthorized advertising is prohibited.",
    ],
  },
  {
    title: "5. Third-Party Links",
    content:
      "CollegeSecracy may contain links to external websites. We are not responsible for the content, policies, or practices of third-party websites.",
  },
  {
    title: "6. Refund & Cancellation Policy",
    content:
      "Payments made for premium features or services are non-refundable. If you wish to cancel your subscription, you may do so before the next billing cycle.",
  },
  {
    title: "7. Account Termination",
    content:
      "We reserve the right to terminate or suspend your account if you violate our policies or engage in malicious activities.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "CollegeSecracy is not responsible for any losses, damages, or legal issues that arise from using our platform.",
  },
  {
    title: "9. Governing Law",
    content:
      "These terms shall be governed by and interpreted in accordance with the laws of [Your Country/State].",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We may update these Terms and Conditions from time to time. It is your responsibility to review them periodically.",
  },
  {
    title: "11. Contact Us",
    content: "For any questions, feel free to reach out at ",
    link: { text: "contact@collegesecracy.com", href: "mailto:contact@collegesecracy.com" },
  },
]

// faqs.js

const studentPageFAQs = [
  {
    question: "How do I use the Rank Calculator?",
    answer: "Just enter your exam score and category details in the Rank Calculator tool to get your estimated All India Rank instantly."
  },
  {
    question: "What is the College Predictor tool for?",
    answer: "The College Predictor helps you discover potential colleges based on your rank, category, and preferred branches or locations."
  },
  {
    question: "How accurate is the Percentile Calculator?",
    answer: "Our Percentile Calculator uses official data trends to give you a close estimate of your percentile based on your raw marks and shift difficulty."
  },
  {
    question: "Where can I calculate my CGPA?",
    answer: "You can calculate your CGPA by entering your semester-wise grades in the CGPA Calculator tool available on your dashboard."
  },
  {
    question: "What is the Marking Scheme section used for?",
    answer: "It shows the latest exam-specific marking schemes, including details about negative marking, subject-wise weightage, and question types."
  },
  {
    question: "How do I check previous year cutoffs?",
    answer: "Use the Cutoff Analyzer tool to view and filter previous year college cutoffs based on branch, category, and rank."
  },
  {
    question: "Can I compare colleges?",
    answer: "Yes! Our Compare Colleges tool lets you evaluate colleges side-by-side based on placement, fees, location, cutoff, and more."
  },
  {
    question: "Is there a way to track my preparation progress?",
    answer: "Yes, the dashboard includes a progress tracker that helps you monitor your performance in practice tests and identify improvement areas."
  },
  {
    question: "How often is the college data updated?",
    answer: "Our team updates college data regularly after every major counseling round and exam season to ensure accuracy and relevance."
  },
  {
    question: "Can I bookmark tools I use frequently?",
    answer: "Absolutely! You can pin your favorite tools on the dashboard for quicker access anytime."
  },
  {
    question: "How accurate is the JEE rank predictor tool?",
    answer: "Our JEE rank predictor uses historical data and statistical models to estimate your rank based on your percentile. While we strive for accuracy, actual ranks may vary slightly due to factors like the number of test-takers and difficulty level variations across sessions."
  },
  {
    question: "What's the difference between JEE Main and JEE Advanced?",
    answer: "JEE Main is the first stage exam for admission to NITs, IIITs, and other engineering colleges. JEE Advanced is the second stage for admission to IITs. Only the top 2.5 lakh JEE Main qualifiers can appear for JEE Advanced."
  },
  {
    question: "How do I calculate my JEE Main percentile?",
    answer: "Your percentile is calculated based on your performance relative to other candidates in your session. You can use our percentile calculator tool by entering your raw score and the total number of candidates in your session."
  },
  {
    question: "What colleges can I get with my JEE rank?",
    answer: "Use our college predictor tool by entering your expected rank. We'll provide a list of probable colleges based on previous year cutoff trends. Remember that cutoffs vary each year based on exam difficulty and number of applicants."
  },
  {
    question: "How is CUET different from JEE?",
    answer: "CUET (Common University Entrance Test) is for admission to central universities across various disciplines, while JEE is specifically for engineering admissions. CUET has different subject combinations depending on your chosen course."
  },
  {
    question: "What documents do I need for counselling registration?",
    answer: "Typically you'll need: JEE/CUET scorecard, class 10 & 12 mark sheets, category certificate (if applicable), domicile certificate, passport photos, and ID proof. Exact requirements may vary by institution."
  }
];

  const Founders =
[ {
      Name : "Chandrashen Yadav, Founder & CEO",
      url : Chandrashen,
      About : "The Founder & CEO of CollegeSeceracy is a visionary leader with a passion for education and technology. With a strong background in both fields, they are dedicated to creating innovative solutions that empower students and educators. Their leadership focuses on bridging the gap between academic knowledge and real-world applications, making education more accessible and impactful. Driven by a commitment to student success, the Founder & CEO leads CollegeSeceracy towards reshaping the future of education, one breakthrough at a time."
  },
  {
    Name : "Krishna Singh, Co-Founder & CTO",
    url : Krishna,
    About : "The Co-Founder & CTO of CollegeSeceracy is a tech-driven visionary with a deep understanding of the intersection between technology and education. With expertise in building scalable systems and cutting-edge solutions, they are at the forefront of innovating tools that enhance the learning experience. Their leadership in technology drives the company's commitment to offering seamless, efficient, and user-friendly platforms. Focused on continuous growth, the Co-Founder & CTO is dedicated to ensuring that CollegeSeceracy stays ahead of technological trends while providing exceptional value to students and educators alike."
  },
]

const TeamMembers = [
  {
    name: "Abhishek Yadav",
    role: "HR",
    department: "Education",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    name: "Rehant Singh",
    role: "Counsellor",
    department: "Technology",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg"
  },
  {
    name: "AS",
    role: "Graphics Designing Lead",
    department: "Operations",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg"
  },
];

const Milestones = [
  {
    date: "January 2020",
    title: "Founded",
    description: "Launched with a small team of 3 people in a campus dorm"
  },
  {
    date: "June 2020",
    title: "First 100 Users",
    description: "Reached our first major milestone of 100 active users"
  },
  {
    date: "December 2021",
    title: "National Expansion",
    description: "Expanded to serve students across the country"
  },
  {
    date: "March 2023",
    title: "Award Winning",
    description: "Recognized as Best EdTech Startup of the Year"
  }
];

const Testimonials = [
  {
    name: "Alex Johnson",
    college: "Harvard University",
    quote: "CollegeSecracy helped me find the perfect mentor for my application",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    name: "Priya Patel",
    college: "Stanford University",
    quote: "The insights I gained from my mentor were invaluable in making my college decision",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    name: "Michael Chen",
    college: "MIT",
    quote: "The platform connected me with alumni who gave me real perspective on campus life",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Sarah Williams",
    college: "Yale University",
    quote: "I wouldn't have gotten into my dream college without CollegeSecracy's guidance",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg"
  }
];

  

export {
    info,
    quality,
    userData,
    Founders,
    homePageFAQs,
    contactPageFAQs,
    TermsAndConditons,
    TeamMembers,
    Milestones,
    Testimonials,
    studentPageFAQs
};


