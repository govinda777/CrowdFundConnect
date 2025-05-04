import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  rewards, type Reward, type InsertReward,
  contributions, type Contribution, type InsertContribution
} from "@shared/schema";

// Define interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(limit?: number): Promise<Project[]>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  
  // Reward operations
  getReward(id: number): Promise<Reward | undefined>;
  getRewardsByProject(projectId: number): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
  updateReward(id: number, data: Partial<InsertReward>): Promise<Reward | undefined>;
  
  // Contribution operations
  getContribution(id: number): Promise<Contribution | undefined>;
  getContributionsByProject(projectId: number): Promise<Contribution[]>;
  getContributionsByUser(userId: number): Promise<Contribution[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private rewards: Map<number, Reward>;
  private contributions: Map<number, Contribution>;
  private userIdCounter: number;
  private projectIdCounter: number;
  private rewardIdCounter: number;
  private contributionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.rewards = new Map();
    this.contributions = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.rewardIdCounter = 1;
    this.contributionIdCounter = 1;
    
    // Add default project and rewards for demo
    this.initDemoData();
  }
  
  // Initialize demo data
  private initDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "demo",
      password: "password123",
      email: "demo@example.com",
      walletAddress: "0x7Da37534E347561BEfC711F1a0dCFcb70735F268"
    };
    const user = this.createUser(demoUser);
    
    // Create TourChain project
    const tourProject: InsertProject = {
      title: "TourChain: Revolução nas Viagens Corporativas",
      description: "Ajude a construir o futuro das viagens corporativas com blockchain, bem-estar e sustentabilidade.",
      goal: 10000000, // $100,000 in cents
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      tokenSymbol: "TOUR",
      contractAddress: "0x7Da37534E347561BEfC711F1a0dCFcb70735F268",
      networkName: "Ethereum (Sepolia Testnet)",
      createdBy: user.id
    };
    const project = this.createProject(tourProject);
    
    // Set raised amount and backers for demo
    this.projects.set(project.id, {
      ...project,
      raised: 6750000, // $67,500 in cents
      backers: 285
    });
    
    // Create reward tiers
    const rewards: InsertReward[] = [
      {
        projectId: project.id,
        title: "Tokens Dinâmicos",
        description: "Compre 100 tokens por um preço que aumenta US$ 1 a cada compra. Quanto mais cedo você comprar, mais econômico será!",
        amount: 100, // $1 in cents
        tokenAmount: 100,
        limit: 1000,
        claimed: 87,
        contractId: "0xDYN",
        isDynamic: true
      },
      {
        projectId: project.id,
        title: "Acesso Antecipado",
        description: "Seja um dos primeiros a utilizar a plataforma TourChain com acesso prioritário e suporte VIP por 3 meses.",
        amount: 25000, // $250 in cents
        tokenAmount: 500,
        limit: 150,
        claimed: 87,
        contractId: "0x001"
      },
      {
        projectId: project.id,
        title: "Pacote Corporativo",
        description: "Licença para até 10 usuários por 6 meses, incluindo acesso a todas as funcionalidades de otimização de custos com IA.",
        amount: 100000, // $1000 in cents
        tokenAmount: 2000,
        limit: 100,
        claimed: 42,
        contractId: "0x002"
      },
      {
        projectId: project.id,
        title: "Parceiro Estratégico",
        description: "Torne-se um parceiro estratégico com acesso ilimitado por 1 ano e participe das reuniões de desenvolvimento de produto.",
        amount: 500000, // $5000 in cents
        tokenAmount: 10000,
        limit: 25,
        claimed: 12,
        contractId: "0x003"
      }
    ];
    
    rewards.forEach(reward => this.createReward(reward));
    
    // Add additional projects for demo
    const additionalProjects: InsertProject[] = [
      {
        title: "EcoTravel: Plataforma de Compensação de Carbono",
        description: "Sistema de rastreamento e compensação de carbono para viagens corporativas usando tokens verdes",
        goal: 8000000, // $80,000 in cents
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        tokenSymbol: "ECO",
        contractAddress: "0x8Eb24319393716668D768dCEC29356ae9CfFe285",
        networkName: "Ethereum (Sepolia Testnet)",
        imageColor: "from-green-500 to-teal-500",
        createdBy: user.id
      },
      {
        title: "BusinessWell: Bem-estar em Viagens",
        description: "Aplicativo que monitora e recompensa hábitos saudáveis durante viagens corporativas",
        goal: 5000000, // $50,000 in cents
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        tokenSymbol: "WELL",
        contractAddress: "0x9Fc3D676AEFf4A96EFBdBE5c5801f9a2F58DD9B3",
        networkName: "Ethereum (Sepolia Testnet)",
        imageColor: "from-blue-500 to-cyan-500",
        createdBy: user.id
      },
      {
        title: "CryptoHotels: Reservas com Blockchain",
        description: "Plataforma descentralizada para reservas de hotéis com pagamentos em criptomoedas",
        goal: 15000000, // $150,000 in cents
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        tokenSymbol: "CHTL",
        contractAddress: "0x2a3C8bFcAB5CfF522AB7F1D05125F8b5Ff1F8F3A",
        networkName: "Ethereum (Sepolia Testnet)",
        imageColor: "from-purple-600 to-violet-600",
        createdBy: user.id
      }
    ];
    
    additionalProjects.forEach(project => {
      const newProject = this.createProject(project);
      // Set raised amount and backers for demo
      if (project.title.includes("EcoTravel")) {
        this.projects.set(newProject.id, {
          ...newProject,
          raised: 4200000, // $42,000 in cents
          backers: 156
        });
      } else if (project.title.includes("BusinessWell")) {
        this.projects.set(newProject.id, {
          ...newProject,
          raised: 2500000, // $25,000 in cents
          backers: 118
        });
      } else if (project.title.includes("CryptoHotels")) {
        this.projects.set(newProject.id, {
          ...newProject,
          raised: 12000000, // $120,000 in cents
          backers: 340
        });
      }
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getProjects(limit?: number): Promise<Project[]> {
    const projects = Array.from(this.projects.values());
    return limit ? projects.slice(0, limit) : projects;
  }
  
  async getProjectsByUser(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.createdBy === userId
    );
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id,
      raised: 0,
      backers: 0,
      isActive: true
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...data };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  // Reward operations
  async getReward(id: number): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }
  
  async getRewardsByProject(projectId: number): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(
      (reward) => reward.projectId === projectId
    );
  }
  
  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = this.rewardIdCounter++;
    const reward: Reward = { 
      ...insertReward, 
      id,
      claimed: insertReward.claimed || 0
    };
    this.rewards.set(id, reward);
    return reward;
  }
  
  async updateReward(id: number, data: Partial<InsertReward>): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (!reward) return undefined;
    
    const updatedReward = { ...reward, ...data };
    this.rewards.set(id, updatedReward);
    return updatedReward;
  }
  
  // Contribution operations
  async getContribution(id: number): Promise<Contribution | undefined> {
    return this.contributions.get(id);
  }
  
  async getContributionsByProject(projectId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.projectId === projectId
    );
  }
  
  async getContributionsByUser(userId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.userId === userId
    );
  }
  
  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = this.contributionIdCounter++;
    const now = new Date();
    const contribution: Contribution = { 
      ...insertContribution, 
      id,
      timestamp: now 
    };
    this.contributions.set(id, contribution);
    
    // Update project stats (raised amount and backers)
    const project = this.projects.get(insertContribution.projectId);
    if (project) {
      const updatedProject = { 
        ...project,
        raised: project.raised + insertContribution.amount,
        backers: project.backers + 1
      };
      this.projects.set(project.id, updatedProject);
    }
    
    // Update reward claimed count
    if (insertContribution.rewardId) {
      const reward = this.rewards.get(insertContribution.rewardId);
      if (reward) {
        const updatedReward = {
          ...reward,
          claimed: reward.claimed + 1
        };
        this.rewards.set(reward.id, updatedReward);
      }
    }
    
    return contribution;
  }
}

export const storage = new MemStorage();
