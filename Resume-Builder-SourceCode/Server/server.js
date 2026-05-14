const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const AUTH_SECRET = process.env.AUTH_SECRET || 'resume-builder-secret';
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://Sneha:Sneha2004@cluster0.ihps6ow.mongodb.net/?appName=Cluster0';
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    summary: String,
    highSchool: String,
    highSchoolMarks: String,
    seniorSecondary: String,
    seniorSecondaryMarks: String,
    college: String,
    collegeMarks: String,
    experience: String,
    projects: String,
    certifications: String,
    achievements: String,
    skills: String,
    technicalSkills: [String]
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);

function buildSupportReply({ name = '', email = '', message = '' }) {
  const normalizedMessage = message.trim().toLowerCase();
  const displayName = name.trim() || 'there';

  let topic = 'general';
  let reply = `Hi ${displayName}, please ask a resume, template, PDF, or account question and I will give a short answer.`;

  if (
    normalizedMessage.includes('software') &&
    normalizedMessage.includes('skill')
  ) {
    topic = 'software-role-skills';
    reply =
      'For a software role, add JavaScript, React, Node.js, SQL, Git, problem solving, debugging, and teamwork if you know them.';
  } else if (
    normalizedMessage.includes('front end') ||
    normalizedMessage.includes('frontend')
  ) {
    topic = 'frontend-skills';
    reply =
      'For a frontend role, add HTML, CSS, JavaScript, React, responsive design, Git, API integration, and UI problem solving.';
  } else if (
    normalizedMessage.includes('back end') ||
    normalizedMessage.includes('backend')
  ) {
    topic = 'backend-skills';
    reply =
      'For a backend role, add Node.js or Java/Python, APIs, databases, authentication, Git, debugging, and system thinking.';
  } else if (
    normalizedMessage.includes('summary') ||
    normalizedMessage.includes('objective')
  ) {
    topic = 'summary';
    reply =
      'Keep your summary to 2 or 3 lines: role, key skills, and what value you can bring.';
  } else if (
    normalizedMessage.includes('project') ||
    normalizedMessage.includes('projects')
  ) {
    topic = 'projects';
    reply =
      'Add 2 or 3 strong projects with project name, tech stack, what you built, and one result or feature.';
  } else if (
    normalizedMessage.includes('experience') ||
    normalizedMessage.includes('internship')
  ) {
    topic = 'experience';
    reply =
      'Write role, company, duration, and 2 or 3 short impact points using action words like built, improved, or developed.';
  } else if (
    normalizedMessage.includes('certification') ||
    normalizedMessage.includes('course')
  ) {
    topic = 'certifications';
    reply =
      'Add relevant certifications only, especially those connected to your target role, tools, or programming skills.';
  } else if (
    normalizedMessage.includes('achievement') ||
    normalizedMessage.includes('award')
  ) {
    topic = 'achievements';
    reply =
      'Add measurable achievements like rankings, hackathon results, leadership roles, awards, or strong academic results.';
  }

  if (
    normalizedMessage.includes('pdf') ||
    normalizedMessage.includes('download') ||
    normalizedMessage.includes('export')
  ) {
    topic = 'pdf';
    reply =
      `Hi ${displayName}, to download your resume PDF, first complete the resume form, save your resume, then click the Download PDF button in the preview panel. ` +
      `If the PDF still does not download, refresh the page once and try again.`;
  } else if (
    normalizedMessage.includes('template') ||
    normalizedMessage.includes('design') ||
    normalizedMessage.includes('style')
  ) {
    topic = 'template';
    reply =
      `Hi ${displayName}, you can choose between the available resume templates from the template section in the builder preview area. ` +
      `After selecting a template, the live preview and downloaded PDF will use the same design.`;
  } else if (
    normalizedMessage.includes('login') ||
    normalizedMessage.includes('sign in') ||
    normalizedMessage.includes('sign up') ||
    normalizedMessage.includes('account')
  ) {
    topic = 'auth';
    reply =
      `Hi ${displayName}, after signing in you should land on the main builder home page first. From there, click Open Builder to start editing your resume. ` +
      `If account access fails, check your email and password and try again.`;
  } else if (
    normalizedMessage.includes('project') ||
    normalizedMessage.includes('experience') ||
    normalizedMessage.includes('certification') ||
    normalizedMessage.includes('achievement') ||
    normalizedMessage.includes('skill')
  ) {
    if (topic === 'general') {
    topic = 'resume-content';
    reply = 'Add only relevant skills and content for your target role. Keep each section short, clear, and specific.';
    }
  }

  return {
    topic,
    reply,
    receivedFrom: email.trim().toLowerCase() || null
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = (storedHash || '').split(':');

  if (!salt || !hash) {
    return false;
  }

  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derivedHash, 'hex'));
}

function signToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      id: String(user._id),
      email: user.email,
      fullName: user.fullName,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })
  ).toString('base64url');

  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return parsed.exp > Date.now() ? parsed : null;
  } catch {
    return null;
  }
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const user = await User.findById(payload.id).select('_id fullName email');

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  req.user = user;
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName = '', email = '', password = '' } = req.body;

    if (!fullName.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password)
    });

    res.status(201).json({
      token: signToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ message: 'Unable to create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email = '', password = '' } = req.body;

    if (!email.trim()) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Unable to login.' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email
    }
  });
});

app.post('/api/support', async (req, res) => {
  try {
    const { name = '', email = '', message = '' } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ message: 'Please enter a question or message.' });
    }

    const supportReply = buildSupportReply({ name, email, message });
    res.json(supportReply);
  } catch (error) {
    console.error('Support reply failed:', error);
    res.status(500).json({ message: 'Unable to generate a support reply right now.' });
  }
});

app.post('/api/resume', requireAuth, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      userId: req.user._id,
      name: req.body.name || req.user.fullName,
      email: req.body.email || req.user.email
    });

    await resume.save();
    res.json({ ...resume.toObject(), generated: true });
  } catch (error) {
    console.error('Failed to save resume:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
