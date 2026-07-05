import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db"
});
const prisma = new PrismaClient({ adapter });

const INITIAL_COURSES = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and database integration from scratch. Build 10 real-world projects and master web deployment pipelines.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-1',
    teacherName: 'Dr. Angela Yu (Demo)',
    rating: 4.8,
    enrolledCount: 1520,
    status: 'approved',
    lectures: [
      {
        id: 'c1-l1',
        title: 'Course Introduction & Workspace Setup',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8IaOg',
        duration: '12:34',
        description: 'Welcome to the bootcamp! In this video, we outline the roadmap and configure VS Code, Node.js, and browser devtools.',
        order: 1
      },
      {
        id: 'c1-l2',
        title: 'HTML5 Semantic Structure & Best Practices',
        videoUrl: 'https://www.youtube.com/embed/qz0aGYMC2g0',
        duration: '18:15',
        description: 'Understand the skeleton of web layouts, semantic elements, and SEO-friendly document architectures.',
        order: 2
      },
      {
        id: 'c1-l3',
        title: 'Modern CSS Layouts: Flexbox and Grid',
        videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
        duration: '25:40',
        description: 'A deep dive into alignment systems, responsive design, and CSS variables for advanced styling.',
        order: 3
      },
      {
        id: 'c1-l4',
        title: 'JavaScript DOM Manipulation & Events',
        videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
        duration: '32:10',
        description: 'Make your web applications interactive! Learn query selectors, event listeners, and dynamic UI updates.',
        order: 4
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Mastering UI/UX Design Principles',
    description: 'Become a professional designer. Master Figma, color theory, typography, spacing systems, and interactive prototyping with user-centered testing.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-2',
    teacherName: 'Sarah Jenkins',
    rating: 4.9,
    enrolledCount: 840,
    status: 'approved',
    lectures: [
      {
        id: 'c2-l1',
        title: 'Figma for Beginners: Interface & Vector Tools',
        videoUrl: 'https://www.youtube.com/embed/zHAa-iaLNgU',
        duration: '15:20',
        description: "An overview of Figma's canvas, layers, frames, components, and direct manipulation tools.",
        order: 1
      },
      {
        id: 'c2-l2',
        title: 'Typography & Visual Hierarchy in Modern Apps',
        videoUrl: 'https://www.youtube.com/embed/Z0oYj08m518',
        duration: '22:45',
        description: "How to scale fonts, pick readable typefaces, and lead the user's eyes naturally down the page.",
        order: 2
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Data Science & Machine Learning with Python',
    description: 'Master Numpy, Pandas, Matplotlib, Scikit-Learn, and regression/classification models. Solve real-world data analysis tasks with industry standards.',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-1',
    teacherName: 'Dr. Angela Yu (Demo)',
    rating: 4.6,
    enrolledCount: 610,
    status: 'approved',
    lectures: [
      {
        id: 'c3-l1',
        title: 'Python Essentials for Data Analysis',
        videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
        duration: '20:10',
        description: 'A quick refresher on lists, dictionaries, comprehensions, and basic control structures in Python.',
        order: 1
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Next.js 14 App Router Deep Dive',
    description: 'Learn React Server Components, Server Actions, file-based routing, server-side rendering, dynamic API endpoints, and middleware authorization in Next.js.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-3',
    teacherName: 'David Miller',
    rating: 0.0,
    enrolledCount: 0,
    status: 'pending',
    lectures: [
      {
        id: 'c4-l1',
        title: 'Server vs Client Components in Next.js',
        videoUrl: 'https://www.youtube.com/embed/843nec-IvW0',
        duration: '14:55',
        description: 'Understand hydration, boundary separation, static pre-rendering, and why SSR leads to superior performance.',
        order: 1
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Advanced TypeScript & Type Level Programming',
    description: 'Master generics, conditional types, mapped types, template literal types, and complex API typed definitions to build extremely robust software.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-1',
    teacherName: 'Dr. Angela Yu (Demo)',
    rating: 4.9,
    enrolledCount: 430,
    status: 'approved',
    lectures: [
      {
        id: 'c5-l1',
        title: 'Introduction to Generics & Constraints',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8IaOg',
        duration: '10:15',
        description: 'Learn how to write reusable functions and interfaces using TS generic parameters and type constraints.',
        order: 1
      },
      {
        id: 'c5-l2',
        title: 'Conditional & Mapped Types deep dive',
        videoUrl: 'https://www.youtube.com/embed/qz0aGYMC2g0',
        duration: '15:40',
        description: 'Take control of dynamic typing! Implement utility types using infer keyword and key remap operators.',
        order: 2
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Creative CSS & SVG Animations',
    description: 'Learn how to design interactive elements, loaders, and page transitions using SVG layouts, greenSock library, and native CSS keyframes.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-2',
    teacherName: 'Sarah Jenkins',
    rating: 4.7,
    enrolledCount: 290,
    status: 'approved',
    lectures: [
      {
        id: 'c6-l1',
        title: 'CSS Keyframes & Custom Timing Functions',
        videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
        duration: '14:05',
        description: 'Understand easing curves, keyframe rules, performance implications, and standard web animation standards.',
        order: 1
      }
    ]
  },
  {
    id: 'course-7',
    title: 'Complete Product Management Bootcamp',
    description: 'Learn agile, scrum, backlog grooming, PRD design, metric assessment, A/B testing, and lead teams effectively to launch great software.',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-3',
    teacherName: 'David Miller',
    rating: 4.8,
    enrolledCount: 980,
    status: 'approved',
    lectures: [
      {
        id: 'c7-l1',
        title: 'The Product Lifecycle & Scrum Frameworks',
        videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
        duration: '16:50',
        description: 'Overview of product states from ideation to release, plus dynamic sprint planning structures.',
        order: 1
      }
    ]
  },
  {
    id: 'course-8',
    title: 'Introduction to Generative AI & LLMs',
    description: 'Understand neural networks, transformers, prompt engineering, few-shot prompting, and fine-tuning language models with PyTorch.',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-1',
    teacherName: 'Dr. Angela Yu (Demo)',
    rating: 4.9,
    enrolledCount: 2450,
    status: 'approved',
    lectures: [
      {
        id: 'c8-l1',
        title: 'Transformer Architectures and Attention mechanisms',
        videoUrl: 'https://www.youtube.com/embed/qz0aGYMC2g0',
        duration: '18:40',
        description: 'Unpack self-attention, query-key-value vectors, positional encodings, and how GPT modules decode sequences.',
        order: 1
      }
    ]
  },
  {
    id: 'course-9',
    title: 'Digital Marketing & SEO Strategy Masterclass',
    description: 'Increase organic web search traffic. Learn search algorithms, page structure auditing, metadata design, and keyword grouping.',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-2',
    teacherName: 'Sarah Jenkins',
    rating: 4.6,
    enrolledCount: 512,
    status: 'approved',
    lectures: [
      {
        id: 'c9-l1',
        title: 'Keyword Research & Competitor Gap Analysis',
        videoUrl: 'https://www.youtube.com/embed/qz0aGYMC2g0',
        duration: '13:25',
        description: 'Find high-volume search phrases, compute keyword difficulty, and build semantic maps to rank higher.',
        order: 1
      }
    ]
  },
  {
    id: 'course-10',
    title: 'Mobile App Development with React Native',
    description: 'Build native iOS and Android apps with a single React codebase. Master styling, state, camera integrations, and push alerts.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-3',
    teacherName: 'David Miller',
    rating: 4.7,
    enrolledCount: 620,
    status: 'approved',
    lectures: [
      {
        id: 'c10-l1',
        title: 'React Native Bridge and Native Components',
        videoUrl: 'https://www.youtube.com/embed/zHAa-iaLNgU',
        duration: '11:50',
        description: 'Understand JSX translation into native UI controls (UIView / android.view) and direct device setup.',
        order: 1
      }
    ]
  },
  {
    id: 'course-11',
    title: 'Introduction to Docker & Kubernetes for Developers',
    description: 'Containerize and orchestrate your applications. Learn image creation, network routing, storage mounts, and replica controllers.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-3',
    teacherName: 'David Miller',
    rating: 4.9,
    enrolledCount: 1105,
    status: 'approved',
    lectures: [
      {
        id: 'c11-l1',
        title: 'Containerization Basics: Images, Layers & Dockerfiles',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8IaOg',
        duration: '15:30',
        description: 'Learn how to write lightweight Dockerfiles, use caching optimization, and run multi-container setups.',
        order: 1
      }
    ]
  },
  {
    id: 'course-12',
    title: 'Modern Data Engineering with Apache Spark',
    description: 'Process big data at scale. Master RDD APIs, Spark SQL DataFrames, lazy evaluation, partitioning, and cluster scheduling.',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-1',
    teacherName: 'Dr. Angela Yu (Demo)',
    rating: 4.8,
    enrolledCount: 340,
    status: 'approved',
    lectures: [
      {
        id: 'c12-l1',
        title: 'Spark Architecture & DataFrame Operations',
        videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
        duration: '16:10',
        description: 'Understand worker nodes, driver programs, transformations vs actions, and optimizing shuffles.',
        order: 1
      }
    ]
  },
  {
    id: 'course-13',
    title: 'Advanced Figma: Design Systems at Scale',
    description: 'Structure clean, accessible design libraries. Master component properties, interactive variables, and dark mode mode swaps.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-2',
    teacherName: 'Sarah Jenkins',
    rating: 4.9,
    enrolledCount: 890,
    status: 'approved',
    lectures: [
      {
        id: 'c13-l1',
        title: 'Figma Variables & Dark Mode Swaps',
        videoUrl: 'https://www.youtube.com/embed/zHAa-iaLNgU',
        duration: '20:30',
        description: 'Learn how to set up semantic color tokens, number variables for spacing, and conditional prototype rules.',
        order: 1
      }
    ]
  },
  {
    id: 'course-14',
    title: 'Cyber Security & Ethical Hacking Basics',
    description: 'Learn penetration testing and secure code design. Master port mapping, cross-site scripting vulnerabilities, and hash cracking.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    teacherId: 'teacher-2',
    teacherName: 'Sarah Jenkins',
    rating: 4.7,
    enrolledCount: 730,
    status: 'approved',
    lectures: [
      {
        id: 'c14-l1',
        title: 'OWASP Top 10 Web Safety Checklist',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8IaOg',
        duration: '23:20',
        description: 'Explore common web vulnerabilities including SQL injections, cross-site scripting (XSS), and insecure direct object references (IDOR).',
        order: 1
      }
    ]
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    courseId: 'course-1',
    userName: 'Alex Johnson',
    rating: 5,
    comment: 'Absolutely spectacular course! Angela makes every complex concept incredibly easy to understand. The projects were challenging and fun.',
    date: '2026-06-18'
  },
  {
    id: 'rev-2',
    courseId: 'course-1',
    userName: 'Emily Davis',
    rating: 4.5,
    comment: 'Loved the section on Flexbox and Grid. The video explanations were very clean. Looking forward to Node.js sections.',
    date: '2026-06-15'
  },
  {
    id: 'rev-3',
    courseId: 'course-2',
    userName: 'Mark Wilson',
    rating: 5,
    comment: 'The typography rules changed the way I build landing pages. Brilliant course, highly visual layout.',
    date: '2026-06-19'
  }
];

const INITIAL_QUESTIONS = [
  {
    id: 'q-1',
    courseId: 'course-1',
    userName: 'Liam Cooper',
    text: 'For lecture 3, is it better to use CSS grid or flexbox for a main navigation bar?',
    date: '2026-06-18',
    answers: [
      {
        id: 'a-1',
        userName: 'Dr. Angela Yu (Demo)',
        text: 'Usually, Flexbox is perfect for a 1D layout like a nav bar (items in a single row). CSS Grid is better for 2D layouts (rows and columns combined).',
        date: '2026-06-19'
      }
    ]
  },
  {
    id: 'q-2',
    courseId: 'course-2',
    userName: 'Sophie Clark',
    text: 'What viewport width do you suggest for scaling typography in responsive mobile grids?',
    date: '2026-06-19',
    answers: []
  }
];

async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.completedLecture.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.course.deleteMany();

  // Seed courses and lectures
  for (const c of INITIAL_COURSES) {
    const { lectures, ...courseData } = c;
    
    await prisma.course.create({
      data: {
        ...courseData,
        lectures: {
          create: lectures
        }
      }
    });
  }

  // Seed reviews
  for (const r of INITIAL_REVIEWS) {
    await prisma.review.create({
      data: r
    });
  }

  // Seed questions and answers
  for (const q of INITIAL_QUESTIONS) {
    const { answers, ...questionData } = q;

    await prisma.question.create({
      data: {
        ...questionData,
        answers: {
          create: answers
        }
      }
    });
  }

  // Seed one user progress entry for demo
  await prisma.userProgress.create({
    data: {
      userEmail: "student@edutube.com",
      courseId: "course-1",
      completedLectures: {
        create: [
          { lectureId: "c1-l1" },
          { lectureId: "c1-l2" }
        ]
      }
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // clean up adapter / client connections
  });
