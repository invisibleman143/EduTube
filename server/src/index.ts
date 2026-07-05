import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  next();
});

// Initialize Prisma Client with the SQLite Driver Adapter
const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db'
});
const prisma = new PrismaClient({ adapter });

// ==========================================
// COURSE ENDPOINTS
// ==========================================

// Get all approved courses (standard student view)
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'approved' },
      include: {
        lectures: {
          orderBy: { order: 'asc' }
        },
        reviews: true,
        questions: {
          include: {
            answers: true
          }
        }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch approved courses' });
  }
});

// Get all courses (admin/teacher view)
app.get('/api/courses/all', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lectures: {
          orderBy: { order: 'asc' }
        },
        reviews: true,
        questions: {
          include: {
            answers: true
          }
        }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all courses' });
  }
});

// Create a new course
app.post('/api/courses', async (req, res) => {
  const { title, description, category, thumbnail, teacherId, teacherName, lectures } = req.body;
  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        thumbnail,
        teacherId,
        teacherName,
        status: 'pending',
        lectures: {
          create: (lectures || []).map((lec: any, index: number) => ({
            title: lec.title,
            videoUrl: lec.videoUrl,
            duration: lec.duration || '10:00',
            description: lec.description || '',
            order: index + 1
          }))
        }
      },
      include: {
        lectures: true
      }
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
app.put('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category, thumbnail, status, feedback, lectures } = req.body;
  try {
    // If lectures are provided, we recreate them for simplicity
    if (lectures) {
      await prisma.lecture.deleteMany({ where: { courseId: id } });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        category,
        thumbnail,
        status,
        feedback,
        ...(lectures && {
          lectures: {
            create: lectures.map((lec: any, index: number) => ({
              id: lec.id,
              title: lec.title,
              videoUrl: lec.videoUrl,
              duration: lec.duration || '10:00',
              description: lec.description || '',
              order: index + 1
            }))
          }
        })
      },
      include: {
        lectures: {
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.course.delete({
      where: { id }
    });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ==========================================
// USER PROGRESS ENDPOINTS
// ==========================================

// Get user progress (enrolled courses and completed lectures)
app.get('/api/progress', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }
  try {
    const progress = await prisma.userProgress.findMany({
      where: { userEmail: String(email) },
      include: {
        completedLectures: true
      }
    });

    // Format output to match the frontend shape: { courseId: string, completedLectureIds: string[] }[]
    const formatted = progress.map(p => ({
      courseId: p.courseId,
      completedLectureIds: p.completedLectures.map(cl => cl.lectureId)
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Enroll in a course
app.post('/api/courses/:id/enroll', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required to enroll' });
  }
  try {
    // Check if progress already exists
    let progress = await prisma.userProgress.findUnique({
      where: {
        courseId_userEmail: {
          courseId: id,
          userEmail: email
        }
      }
    });

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          courseId: id,
          userEmail: email
        }
      });

      // Increment enrolled count of the course
      await prisma.course.update({
        where: { id },
        data: {
          enrolledCount: { increment: 1 }
        }
      });
    }

    res.status(200).json({ message: 'Enrolled successfully', progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Toggle lecture completion
app.post('/api/progress/toggle-lecture', async (req, res) => {
  const { courseId, lectureId, email } = req.body;
  if (!courseId || !lectureId || !email) {
    return res.status(400).json({ error: 'courseId, lectureId, and email are required' });
  }
  try {
    // Ensure the progress record exists
    let progress = await prisma.userProgress.findUnique({
      where: {
        courseId_userEmail: {
          courseId,
          userEmail: email
        }
      },
      include: {
        completedLectures: true
      }
    });

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          courseId,
          userEmail: email
        },
        include: {
          completedLectures: true
        }
      });
    }

    // Check if the lecture is already completed
    const existing = await prisma.completedLecture.findUnique({
      where: {
        userProgressId_lectureId: {
          userProgressId: progress.id,
          lectureId
        }
      }
    });

    if (existing) {
      // Unmark complete
      await prisma.completedLecture.delete({
        where: { id: existing.id }
      });
    } else {
      // Mark complete
      await prisma.completedLecture.create({
        data: {
          userProgressId: progress.id,
          lectureId
        }
      });
    }

    // Return the updated list of completed lecture IDs
    const updatedProgress = await prisma.userProgress.findUnique({
      where: { id: progress.id },
      include: { completedLectures: true }
    });

    res.json({
      courseId,
      completedLectureIds: updatedProgress?.completedLectures.map(cl => cl.lectureId) || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle lecture completion' });
  }
});

// ==========================================
// REVIEW ENDPOINTS
// ==========================================

// Add a review to a course
app.post('/api/courses/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { userName, rating, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        courseId: id,
        userName: userName || 'Anonymous Student',
        rating: Number(rating) || 5,
        comment: comment || '',
        date: new Date().toISOString().split('T')[0]
      }
    });

    // Recalculate average rating for the course
    const courseReviews = await prisma.review.findMany({
      where: { courseId: id }
    });
    const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;

    await prisma.course.update({
      where: { id },
      data: {
        rating: avgRating
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// ==========================================
// Q&A ENDPOINTS
// ==========================================

// Add a question to a course Q&A
app.post('/api/courses/:id/questions', async (req, res) => {
  const { id } = req.params;
  const { userName, text } = req.body;
  try {
    const question = await prisma.question.create({
      data: {
        courseId: id,
        userName: userName || 'Anonymous Student',
        text,
        date: new Date().toISOString().split('T')[0]
      },
      include: {
        answers: true
      }
    });
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Reply/Add answer to a question
app.post('/api/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params;
  const { userName, text } = req.body;
  try {
    const answer = await prisma.answer.create({
      data: {
        questionId,
        userName: userName || 'Instructor',
        text,
        date: new Date().toISOString().split('T')[0]
      }
    });
    res.status(201).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// Approve course
app.post('/api/courses/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.update({
      where: { id },
      data: {
        status: 'approved',
        feedback: null
      }
    });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve course' });
  }
});

// Reject course
app.post('/api/courses/:id/reject', async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;
  try {
    const course = await prisma.course.update({
      where: { id },
      data: {
        status: 'rejected',
        feedback: feedback || 'Rejected by Admin.'
      }
    });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject course' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`EduTube Backend Server running on http://localhost:${port}`);
});
