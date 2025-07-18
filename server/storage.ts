import { 
  users, subjects, courses, exercises, userProgress, exerciseResults, dailyStats, appointments,
  type User, type Subject, type Course, type Exercise, type UserProgress, 
  type ExerciseResult, type DailyStats, type Appointment,
  type InsertUser, type InsertSubject, type InsertCourse, type InsertExercise,
  type InsertUserProgress, type InsertExerciseResult, type InsertDailyStats, type InsertAppointment
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Subjects
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Courses
  getCoursesBySubject(subjectId: number): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Exercises
  getExercisesByCourse(courseId: number): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getSubjectProgress(userId: number, subjectId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, subjectId: number, courseId: number, progress: number): Promise<UserProgress>;

  // Exercise Results
  getUserExerciseResults(userId: number): Promise<ExerciseResult[]>;
  createExerciseResult(result: InsertExerciseResult): Promise<ExerciseResult>;
  getExerciseResult(userId: number, exerciseId: number): Promise<ExerciseResult | undefined>;

  // Daily Stats
  getDailyStats(userId: number, date: string): Promise<DailyStats | undefined>;
  updateDailyStats(userId: number, date: string, updates: Partial<DailyStats>): Promise<DailyStats>;

  // Appointments
  getUserAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private subjects: Map<number, Subject> = new Map();
  private courses: Map<number, Course> = new Map();
  private exercises: Map<number, Exercise> = new Map();
  private userProgress: Map<string, UserProgress> = new Map(); // key: userId-subjectId
  private exerciseResults: Map<string, ExerciseResult> = new Map(); // key: userId-exerciseId
  private dailyStats: Map<string, DailyStats> = new Map(); // key: userId-date
  private appointments: Map<number, Appointment> = new Map();
  
  private currentUserId = 1;
  private currentSubjectId = 1;
  private currentCourseId = 1;
  private currentExerciseId = 1;
  private currentProgressId = 1;
  private currentResultId = 1;
  private currentStatsId = 1;
  private currentAppointmentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "kouadio",
      firstName: "Kouadio",
      lastName: "Etudiant",
      grade: "3ème",
      totalPoints: 1247,
      streak: 7,
      createdAt: new Date()
    };
    this.users.set(1, defaultUser);

    // Initialize subjects
    const subjectsData: Subject[] = [
      { id: 1, name: "Mathématiques", slug: "math", icon: "calculator", color: "hsl(0, 72%, 51%)" },
      { id: 2, name: "Français", slug: "french", icon: "feather", color: "hsl(258, 90%, 66%)" },
      { id: 3, name: "Physique", slug: "physics", icon: "atom", color: "hsl(45, 93%, 47%)" },
      { id: 4, name: "Chimie", slug: "chemistry", icon: "flask", color: "hsl(142, 71%, 45%)" },
      { id: 5, name: "Histoire", slug: "history", icon: "landmark", color: "hsl(25, 95%, 53%)" },
      { id: 6, name: "Anglais", slug: "english", icon: "globe", color: "hsl(217, 91%, 60%)" }
    ];
    
    subjectsData.forEach(subject => this.subjects.set(subject.id, subject));

    // Initialize History course with real content
    const historyCourse: Course = {
      id: 1,
      subjectId: 5, // History
      title: "Les relations UE/ACP : un exemple de coopération Nord-Sud",
      slug: "relations-ue-acp",
      content: {
        introduction: "La coopération entre l'Union Européenne (UE) et les pays d'Afrique, des Caraïbes et du Pacifique (ACP), remonte au traité de Rome du 25 Mars 1957, instituant la communauté économique Européenne (CEE) par 6 États décidés à construire une organisation économique en association avec leurs anciennes colonies.",
        sections: [
          {
            title: "Les relations UE/ACP : des relations mettant en rapport deux groupes de pays",
            subsections: [
              {
                title: "Les pays UE et leurs caractéristiques",
                content: "Les pays de l'UE sont l'Allemagne de l'Ouest (RFA), la Belgique, la France, l'Italie, le Luxembourg, les Pays-Bas (« l'Europe des Six »). L'UE est établit le 1er novembre 1993 remplaçant la CEE créée en 1957 par la mise en vigueur du traité de Maastricht. Aujourd'hui l'UE compte 26 pays membres après la sortie du Royaume-Uni en 2020 suite au Brexit."
              },
              {
                title: "Les pays ACP et leurs caractéristiques", 
                content: "Ces pays se retrouvent dans l'hémisphère Sud. Le secteur d'activité le plus développé dans ces pays du Sud c'est le secteur primaire, surtout l'agriculture. Leur économie est dominée par les productions de matières premières agricoles auxquelles il faut ajouter les ressources naturelles."
              }
            ]
          },
          {
            title: "Les relations UE/ACP : des relations historiques et dynamiques",
            subsections: [
              {
                title: "Les origines des relations UE/ACP",
                content: "L'origine de la CEE remonte à la création de la CECA (Communauté Economique pour le Charbon et l'Acier) le 02 avril 1951. Les premiers accords signés sont les accords de Yaoundé signés le 20 juillet 1963."
              }
            ]
          },
          {
            title: "Les relations UE/ACP : des relations empreintes de forces et de faiblesses",
            subsections: [
              {
                title: "Les forces des relations UE/ACP",
                content: "Mise en place d'une relation contractuelle entre partenaires égaux couvrant un champ extrêmement large avec pour objectif le développement durable; l'accroissement de la coopération sur les questions de sécurité et amorcé une coopération sur les migrations; les progrès majeurs en matière de développement social et humain."
              },
              {
                title: "Les faiblesses des relations UE/ACP", 
                content: "Les limites du partenariat dans sa dimension politique; un manque de résultats sur les grands sujets liés aux défis globaux; la mise en place de relation inéquitable car les échanges commerciaux entre l'UE et les ACP prenaient la forme d'accords asymétriques."
              }
            ]
          }
        ],
        conclusion: "Les relations UE/ACP naissent avec la création de la CEE consistée de pays européens en 1957 et la volonté de celle-ci de garder des liens avec les TOM. Les relations UE/ACP est un bel exemple de coopération NORD/SUD malgré ses insuffisances."
      },
      difficulty: "intermediate",
      estimatedTime: 45,
      createdAt: new Date()
    };
    this.courses.set(1, historyCourse);

    // Initialize exercises for the History course
    const classificationExercise: Exercise = {
      id: 1,
      courseId: 1,
      type: "classification",
      title: "Classification des pays UE/ACP",
      content: {
        instruction: "Classez dans le tableau ci-dessous convenablement les pays suivants :",
        countries: [
          { name: "Côte-d'Ivoire", type: "acp" },
          { name: "France", type: "eu" },
          { name: "Afrique du Sud", type: "acp" },
          { name: "Nigeria", type: "acp" },
          { name: "Portugal", type: "eu" },
          { name: "Bahamas", type: "acp" },
          { name: "Angola", type: "acp" },
          { name: "Italie", type: "eu" },
          { name: "Suède", type: "eu" },
          { name: "Espagne", type: "eu" },
          { name: "Île Maurice", type: "acp" },
          { name: "République Dominicaine", type: "acp" },
          { name: "Allemagne", type: "eu" },
          { name: "Sénégal", type: "acp" },
          { name: "Mali", type: "acp" },
          { name: "Haïti", type: "acp" },
          { name: "Finlande", type: "eu" },
          { name: "Hollande", type: "eu" }
        ]
      },
      points: 20,
      createdAt: new Date()
    };

    const qcmExercise: Exercise = {
      id: 2,
      courseId: 1,
      type: "qcm",
      title: "QCM - Les relations UE/ACP",
      content: {
        instruction: "10 questions - une seule bonne réponse par question",
        questions: [
          {
            question: "Quelle organisation a été créée par le traité de Rome en 1957 ?",
            options: [
              "La Communauté européenne du développement",
              "L'Union Européenne",
              "La Communauté Économique Européenne (CEE)",
              "Le Groupe ACP"
            ],
            correct: 2
          },
          {
            question: "Quel événement marque le passage de la CEE à l'Union Européenne ?",
            options: [
              "La convention de Lomé",
              "L'adhésion de la Grande-Bretagne",
              "Le traité de Maastricht",
              "L'accord de Cotonou"
            ],
            correct: 2
          },
          {
            question: "Quel secteur est le plus développé dans les pays ACP ?",
            options: [
              "Le secteur industriel",
              "Le secteur tertiaire",
              "Le secteur technologique",
              "Le secteur primaire"
            ],
            correct: 3
          },
          {
            question: "En quelle année a été signé le traité de Rome ?",
            options: ["1951", "1957", "1963", "1975"],
            correct: 1
          },
          {
            question: "Quel pays n'est plus membre de l'Union Européenne depuis 2020 ?",
            options: ["L'Espagne", "L'Allemagne", "Le Royaume-Uni", "Le Portugal"],
            correct: 2
          },
          {
            question: "Quel est le nom du premier accord de coopération entre la CEE et les États africains ?",
            options: ["Accord de Cotonou", "Accord de Lomé", "Accord de Yaoundé", "Accord de Lisbonne"],
            correct: 2
          },
          {
            question: "Quelle est la principale fonction du Fonds Européen de Développement (FED) ?",
            options: [
              "Soutenir l'agriculture européenne",
              "Financer les campagnes électorales en UE",
              "Financer les infrastructures économiques et sociales dans les pays ACP",
              "Organiser le commerce transatlantique"
            ],
            correct: 2
          },
          {
            question: "Quel accord remplace la convention de Lomé en 2000 ?",
            options: ["Accord de Lisbonne", "Accord de Yaoundé II", "Accord de Cotonou", "Accord de Nairobi"],
            correct: 2
          },
          {
            question: "Quelle critique majeure est faite aux Accords de Partenariat Économique (APE) ?",
            options: [
              "Ils favorisent l'union monétaire en Afrique",
              "Ils sont imposés par les pays ACP",
              "Ils renforcent le caractère inégal du partenariat",
              "Ils suppriment les droits de douane en UE"
            ],
            correct: 2
          },
          {
            question: "Parmi les faiblesses des relations UE/ACP, on peut citer :",
            options: [
              "La hausse continue des investissements ACP",
              "L'efficacité des accords de libre-échange",
              "L'égalité totale dans les partenariats commerciaux",
              "La détérioration des termes de l'échange"
            ],
            correct: 3
          }
        ]
      },
      points: 30,
      createdAt: new Date()
    };

    this.exercises.set(1, classificationExercise);
    this.exercises.set(2, qcmExercise);

    // Initialize user progress
    const progressData = [
      { userId: 1, subjectId: 1, progress: 75 }, // Math
      { userId: 1, subjectId: 2, progress: 60 }, // French
      { userId: 1, subjectId: 3, progress: 45 }, // Physics
      { userId: 1, subjectId: 4, progress: 80 }, // Chemistry
      { userId: 1, subjectId: 5, progress: 55 }, // History
      { userId: 1, subjectId: 6, progress: 90 }  // English
    ];

    progressData.forEach((data, index) => {
      const progress: UserProgress = {
        id: index + 1,
        userId: data.userId,
        subjectId: data.subjectId,
        courseId: data.subjectId === 5 ? 1 : undefined,
        progress: data.progress,
        lastAccessedAt: new Date()
      };
      this.userProgress.set(`${data.userId}-${data.subjectId}`, progress);
    });

    // Initialize daily stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats: DailyStats = {
      id: 1,
      userId: 1,
      date: today,
      timeSpent: 150, // 2h30min
      exercisesCompleted: 12,
      pointsEarned: 85
    };
    this.dailyStats.set(`1-${today}`, todayStats);

    // Initialize appointments
    const appointmentsData: Appointment[] = [
      {
        id: 1,
        userId: 1,
        subjectId: 1,
        teacherName: "M. Kouakou",
        title: "Révision Mathématiques",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        type: "video",
        status: "scheduled"
      },
      {
        id: 2,
        userId: 1,
        subjectId: 2,
        teacherName: "Mme Diabaté",
        title: "Session Français",
        scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // In 4 days (Friday)
        type: "chat",
        status: "scheduled"
      }
    ];

    appointmentsData.forEach(appointment => {
      this.appointments.set(appointment.id, appointment);
    });

    this.currentUserId = 2;
    this.currentSubjectId = 7;
    this.currentCourseId = 2;
    this.currentExerciseId = 3;
    this.currentProgressId = 7;
    this.currentResultId = 1;
    this.currentStatsId = 2;
    this.currentAppointmentId = 3;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Subjects
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }

  // Courses
  async getCoursesBySubject(subjectId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.subjectId === subjectId);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(course => course.slug === slug);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id, createdAt: new Date() };
    this.courses.set(id, course);
    return course;
  }

  // Exercises
  async getExercisesByCourse(courseId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(exercise => exercise.courseId === courseId);
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const exercise: Exercise = { ...insertExercise, id, createdAt: new Date() };
    this.exercises.set(id, exercise);
    return exercise;
  }

  // User Progress
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getSubjectProgress(userId: number, subjectId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${subjectId}`);
  }

  async updateUserProgress(userId: number, subjectId: number, courseId: number, progress: number): Promise<UserProgress> {
    const key = `${userId}-${subjectId}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated = { 
        ...existing, 
        courseId: courseId || existing.courseId, 
        progress: Math.max(existing.progress, progress),
        lastAccessedAt: new Date()
      };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        subjectId,
        courseId,
        progress,
        lastAccessedAt: new Date()
      };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }

  // Exercise Results
  async getUserExerciseResults(userId: number): Promise<ExerciseResult[]> {
    return Array.from(this.exerciseResults.values()).filter(result => result.userId === userId);
  }

  async createExerciseResult(insertResult: InsertExerciseResult): Promise<ExerciseResult> {
    const id = this.currentResultId++;
    const result: ExerciseResult = { ...insertResult, id, completedAt: new Date() };
    this.exerciseResults.set(`${result.userId}-${result.exerciseId}`, result);
    return result;
  }

  async getExerciseResult(userId: number, exerciseId: number): Promise<ExerciseResult | undefined> {
    return this.exerciseResults.get(`${userId}-${exerciseId}`);
  }

  // Daily Stats
  async getDailyStats(userId: number, date: string): Promise<DailyStats | undefined> {
    return this.dailyStats.get(`${userId}-${date}`);
  }

  async updateDailyStats(userId: number, date: string, updates: Partial<DailyStats>): Promise<DailyStats> {
    const key = `${userId}-${date}`;
    const existing = this.dailyStats.get(key);
    
    if (existing) {
      const updated = { ...existing, ...updates };
      this.dailyStats.set(key, updated);
      return updated;
    } else {
      const id = this.currentStatsId++;
      const newStats: DailyStats = {
        id,
        userId,
        date,
        timeSpent: 0,
        exercisesCompleted: 0,
        pointsEarned: 0,
        ...updates
      };
      this.dailyStats.set(key, newStats);
      return newStats;
    }
  }

  // Appointments
  async getUserAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.userId === userId)
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }
}

export const storage = new MemStorage();
